import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { testContext, registration } from "./helpers.js";

let context;
before(async () => {
  context = await testContext();
});
after(async () => context?.close());
const post = (path, body) =>
  request(context.app)
    .post(`/api/v1${path}`)
    .set("Origin", context.config.origins[0])
    .send(body);
test("registro institucional almacena hash y nunca inventa la verificación", async () => {
  const response = await post("/auth/register", registration("one"));
  assert.equal(response.status, 201);
  assert.equal(response.body.user.verified, false);
  assert.equal(response.body.verificationSent, true);
  const stored = (
    await context.db.query(
      "SELECT password_hash,student_hash FROM users WHERE id=$1",
      [response.body.user.id],
    )
  ).rows[0];
  assert.match(stored.password_hash, /^\$argon2id\$/);
  assert.notEqual(stored.student_hash, registration("one").studentId);
  assert.equal(response.body.user.password_hash, undefined);
});
test("rechaza dominios ajenos, contraseñas cortas, roles y duplicados", async () => {
  assert.equal(
    (
      await post("/auth/register", {
        ...registration("bad"),
        email: "student@campus.test.attacker.com",
      })
    ).status,
    400,
  );
  assert.equal(
    (await post("/auth/register", { ...registration("bad"), password: "123" }))
      .status,
    400,
  );
  assert.equal(
    (await post("/auth/register", { ...registration("bad"), role: "admin" }))
      .status,
    400,
  );
  assert.equal((await post("/auth/register", registration("one"))).status, 409);
});
test("el enlace de verificación es de un solo uso", async () => {
  const token = context.mail.find(
    (mail) =>
      mail.to === registration("one").email && mail.purpose === "verify",
  ).token;
  assert.equal((await post("/auth/verify", { token })).status, 200);
  assert.equal((await post("/auth/verify", { token })).status, 400);
});
test("sesión HttpOnly, CSRF, persistencia y cierre revocable", async () => {
  const agent = request.agent(context.app);
  const login = await agent
    .post("/api/v1/auth/login")
    .set("Origin", context.config.origins[0])
    .send({
      email: registration("one").email,
      password: registration("one").password,
    });
  assert.equal(login.status, 200);
  assert.match(login.headers["set-cookie"][0], /HttpOnly/);
  assert.equal(login.body.user.verified, true);
  assert.equal(
    (await agent.get("/api/v1/auth/session")).body.user.email,
    registration("one").email,
  );
  assert.equal(
    (
      await agent
        .post("/api/v1/auth/logout")
        .set("Origin", context.config.origins[0])
    ).status,
    403,
  );
  assert.equal(
    (
      await agent
        .post("/api/v1/auth/logout")
        .set("Origin", context.config.origins[0])
        .set("X-CSRF-Token", login.body.csrfToken)
    ).status,
    200,
  );
  assert.equal((await agent.get("/api/v1/auth/session")).body.user, null);
});
test("recuperación cambia la contraseña y revoca las sesiones previas", async () => {
  const login = await post("/auth/login", {
    email: registration("one").email,
    password: registration("one").password,
  });
  await post("/auth/password-reset", { email: registration("one").email });
  const token = context.mail.findLast((mail) => mail.purpose === "reset").token;
  assert.equal(
    (
      await post("/auth/password-reset/confirm", {
        token,
        password: "Mi nueva contraseña segura 2026!",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await request(context.app)
        .get("/api/v1/auth/session")
        .set("Cookie", login.headers["set-cookie"])
    ).body.user,
    null,
  );
  assert.equal(
    (
      await post("/auth/login", {
        email: registration("one").email,
        password: registration("one").password,
      })
    ).status,
    401,
  );
});
test("rechaza orígenes extraños y tokens vencidos", async () => {
  assert.equal(
    (
      await request(context.app)
        .post("/api/v1/auth/login")
        .set("Origin", "https://attacker.invalid")
        .send({})
    ).status,
    403,
  );
  await post("/auth/register", registration("expired"));
  const token = context.mail.findLast(
    (mail) => mail.purpose === "verify",
  ).token;
  await context.db.query(
    "UPDATE access_tokens SET expires_at=now()-interval '1 minute'",
  );
  assert.equal((await post("/auth/verify", { token })).status, 400);
});
