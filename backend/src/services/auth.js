import argon2 from "argon2";
import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { privateUser, userRepository } from "../repositories/users.js";
import { fail } from "../middleware/errors.js";
import {
  validate,
  registerSchema,
  loginSchema,
  profileSchema,
  tokenSchema,
  email,
  password,
  z,
} from "../validators/index.js";

const digest = (token) => createHash("sha256").update(token).digest("hex");
export function createAuth({ db, config, mailer }) {
  const users = userRepository(db);
  const dummyHash = argon2.hash(randomBytes(32), { type: argon2.argon2id });
  const csrfFor = (token) =>
    createHmac("sha256", config.secret).update(`csrf:${token}`).digest("hex");
  async function sendToken(user, purpose) {
    if (!mailer.available) return false;
    const token = randomBytes(32).toString("hex");
    const hash = digest(token);
    await db.transaction(async (client) => {
      await client.query(
        "DELETE FROM access_tokens WHERE user_id=$1 AND purpose=$2",
        [user.id, purpose],
      );
      await client.query(
        "INSERT INTO access_tokens(token_hash,user_id,purpose,expires_at) VALUES($1,$2,$3,now()+$4*interval '1 minute')",
        [hash, user.id, purpose, purpose === "verify" ? 1440 : 30],
      );
    });
    try {
      return await mailer.send({ to: user.email, purpose, token });
    } catch {
      await db.query("DELETE FROM access_tokens WHERE token_hash=$1", [hash]);
      console.error(JSON.stringify({ event: "mail_delivery_failed" }));
      return false;
    }
  }
  return {
    csrfFor,
    async register(value) {
      const input = validate(registerSchema, value);
      if (!config.domains.includes(input.email.split("@")[1]))
        fail(
          400,
          "INSTITUTIONAL_DOMAIN",
          "Usa un dominio institucional autorizado.",
          { email: "Dominio no autorizado." },
        );
      if (!(await users.activeCareer(input.career)))
        fail(400, "INVALID_CAREER", "Selecciona una carrera activa.");
      const studentHash = createHmac("sha256", config.secret)
        .update(input.studentId.toUpperCase())
        .digest("hex");
      const passwordHash = await argon2.hash(input.password, {
        type: argon2.argon2id,
      });
      let user;
      try {
        user = await users.create({ ...input, studentHash, passwordHash });
      } catch (error) {
        if (error.code === "23505")
          fail(
            409,
            "ACCOUNT_EXISTS",
            "El correo o la matrícula ya están registrados.",
          );
        throw error;
      }
      return {
        user: privateUser(user),
        verificationSent: await sendToken(user, "verify"),
      };
    },
    async login(value) {
      const input = validate(loginSchema, value);
      const user = await users.byEmail(input.email);
      const matches = await argon2.verify(
        user?.password_hash || (await dummyHash),
        input.password,
      );
      if (!user || !matches || user.suspended)
        fail(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
      const token = randomBytes(32).toString("hex");
      await db.query("DELETE FROM sessions WHERE expires_at<=now()");
      await db.query(
        "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+$3*interval '1 hour')",
        [digest(token), user.id, config.sessionHours],
      );
      return { token, user: privateUser(user), csrfToken: csrfFor(token) };
    },
    async session(token) {
      if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
      const user = (
        await db.query(
          "SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND NOT u.suspended",
          [digest(token)],
        )
      ).rows[0];
      return user
        ? { user: privateUser(user), csrfToken: csrfFor(token) }
        : null;
    },
    validCsrf(token, value) {
      return (
        typeof value === "string" &&
        /^[a-f0-9]{64}$/.test(value) &&
        timingSafeEqual(
          Buffer.from(csrfFor(token), "hex"),
          Buffer.from(value, "hex"),
        )
      );
    },
    async logout(token) {
      await db.query("DELETE FROM sessions WHERE token_hash=$1", [
        digest(token),
      ]);
    },
    async updateProfile(id, value) {
      const input = validate(profileSchema, value);
      if (!(await users.activeCareer(input.career)))
        fail(400, "INVALID_CAREER", "Selecciona una carrera activa.");
      return privateUser(await users.profile(id, input));
    },
    async resend(user) {
      return user.verified ? true : sendToken(user, "verify");
    },
    async requestReset(value) {
      const input = validate(z.object({ email }).strict(), value);
      const user = await users.byEmail(input.email);
      if (user && !user.suspended) await sendToken(user, "reset");
      return {
        message:
          "Si la cuenta es válida y el envío está configurado, recibirás un enlace de recuperación.",
        emailDeliveryConfigured: mailer.available,
      };
    },
    async consumeToken(value, purpose) {
      const schema =
        purpose === "reset"
          ? tokenSchema.extend({ password }).strict()
          : tokenSchema;
      const input = validate(schema, value);
      const passwordHash =
        purpose === "reset"
          ? await argon2.hash(input.password, { type: argon2.argon2id })
          : null;
      await db.transaction(async (client) => {
        const access = (
          await client.query(
            "SELECT t.*,u.suspended FROM access_tokens t JOIN users u ON u.id=t.user_id WHERE t.token_hash=$1 AND t.purpose=$2 AND t.expires_at>now() FOR UPDATE",
            [digest(input.token), purpose],
          )
        ).rows[0];
        if (!access || access.suspended)
          fail(
            400,
            "INVALID_TOKEN",
            "El enlace no es válido, ya se usó o caducó.",
          );
        if (purpose === "verify")
          await client.query(
            "UPDATE users SET verified_at=COALESCE(verified_at,now()) WHERE id=$1",
            [access.user_id],
          );
        else {
          await client.query("UPDATE users SET password_hash=$2 WHERE id=$1", [
            access.user_id,
            passwordHash,
          ]);
          await client.query("DELETE FROM sessions WHERE user_id=$1", [
            access.user_id,
          ]);
        }
        await client.query(
          "DELETE FROM access_tokens WHERE user_id=$1 AND purpose=$2",
          [access.user_id, purpose],
        );
      });
      return {
        message:
          purpose === "verify"
            ? "Correo institucional verificado. Ya puedes iniciar sesión."
            : "Contraseña actualizada. Vuelve a iniciar sesión.",
      };
    },
  };
}
