import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
import request from "supertest";
import sharp from "sharp";
import {
  testContext,
  createTestUser,
  createTestListing,
  registration,
} from "./helpers.js";
import { createListings } from "../src/services/listings.js";
import { createApp } from "../src/app.js";

let context, seller, buyer;
before(async () => {
  context = await testContext();
  seller = await createTestUser(context, "security-seller");
  buyer = await createTestUser(context, "security-buyer");
});
after(async () => context?.close());

test("SEC-01 registro no revela si el correo o la matrícula ya existen", async () => {
  const input = registration("enumeration");
  const register = (body) =>
    request(context.app)
      .post("/api/v1/auth/register")
      .set("Origin", context.config.origins[0])
      .send(body);
  const created = await register(input);
  const duplicateEmail = await register({
    ...input,
    studentId: "OTHER-STUDENT",
  });
  const duplicateStudent = await register({
    ...input,
    email: "another@campus.test",
  });
  assert.deepEqual(
    [duplicateEmail.status, duplicateStudent.status],
    [created.status, created.status],
  );
  assert.deepEqual(duplicateEmail.body, created.body);
  assert.deepEqual(duplicateStudent.body, created.body);
  assert.equal(created.body.user, undefined);
});

test("SEC-02 subidas concurrentes respetan el cupo de veinte imágenes pendientes", async () => {
  const owner = await createTestUser(context, "security-upload");
  for (let i = 0; i < 19; i++)
    await context.db.query(
      "INSERT INTO listing_images(owner_id,object_key,mime_type,size) VALUES($1,$2,'image/webp',1)",
      [owner.user.id, `${randomUUID()}.webp`],
    );
  let writes = 0;
  const storage = {
    async put() {
      writes++;
      await setTimeout(100);
    },
    async remove() {},
  };
  const service = createListings({ db: context.db, storage });
  const buffer = await sharp({
    create: { width: 8, height: 8, channels: 3, background: "#fff" },
  })
    .png()
    .toBuffer();
  const file = {
    buffer,
    size: buffer.length,
    originalname: "safe.png",
    mimetype: "image/png",
  };
  const results = await Promise.allSettled(
    Array.from({ length: 4 }, () => service.upload(owner.user, file)),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(
    results.filter(
      (r) => r.status === "rejected" && r.reason.code === "IMAGE_QUOTA",
    ).length,
    3,
  );
  assert.equal(writes, 1);
  assert.equal(
    (
      await context.db.query(
        "SELECT count(*)::int AS count FROM listing_images WHERE owner_id=$1 AND listing_id IS NULL",
        [owner.user.id],
      )
    ).rows[0].count,
    20,
  );
});

test("SEC-03 una devolución anterior no libera una renta posterior", async () => {
  const item = await createTestListing(context, seller, {
    modality: "rental",
    price: 20,
  });
  const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  async function rent() {
    const result = await buyer.send("post", "/operations", {
      listingId: item.id,
      rentalStart: date,
      rentalEnd: date,
    });
    assert.equal(result.status, 201);
    const id = result.body.operation.id;
    assert.equal(
      (await seller.send("patch", `/operations/${id}`, { status: "accepted" }))
        .status,
      200,
    );
    assert.equal(
      (await seller.send("patch", `/operations/${id}`, { status: "completed" }))
        .status,
      200,
    );
    return id;
  }
  const first = await rent();
  assert.equal(
    (await seller.send("post", `/operations/${first}/return`)).status,
    200,
  );
  const second = await rent();
  assert.equal(
    (await seller.send("post", `/operations/${first}/return`)).status,
    409,
  );
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${item.id}`)).body.item
      .status,
    "rented",
  );
  assert.equal(
    (await seller.send("post", `/operations/${second}/return`)).status,
    200,
  );
});

test("SEC-04 aceptar un intercambio revalida la modalidad de la oferta", async () => {
  const item = await createTestListing(context, seller, {
    modality: "exchange",
    price: 0,
  });
  const offered = await createTestListing(context, buyer, {
    modality: "exchange",
    price: 0,
  });
  const result = await buyer.send("post", "/operations", {
    listingId: item.id,
    offeredListingId: offered.id,
  });
  assert.equal(result.status, 201);
  const edit = await buyer.send("patch", `/listings/${offered.id}`, {
    title: offered.title,
    description: offered.description,
    location: offered.location,
    career: offered.career,
    condition: offered.condition,
    categoryId: offered.categoryId,
    modality: "sale",
    price: 50,
    imageIds: [],
  });
  assert.equal(edit.status, 200);
  assert.equal(
    (
      await seller.send("patch", `/operations/${result.body.operation.id}`, {
        status: "accepted",
      })
    ).status,
    409,
  );
  for (const id of [item.id, offered.id])
    assert.equal(
      (await request(context.app).get(`/api/v1/listings/${id}`)).body.item
        .status,
      "available",
    );
});

test("SEC-05 login limita fallos de una cuenta aunque cambie la IP", async () => {
  const app = createApp({
    db: context.db,
    config: { ...context.config, testMode: false, trustProxy: 1 },
    mailer: context.mailer,
  });
  const statuses = [];
  for (let i = 1; i <= 11; i++)
    statuses.push(
      (
        await request(app)
          .post("/api/v1/auth/login")
          .set("Origin", context.config.origins[0])
          .set("X-Forwarded-For", `192.0.2.${i}`)
          .send({
            email:
              i % 2
                ? registration("security-seller").email.toUpperCase()
                : registration("security-seller").email,
            password: "wrong-password",
          })
      ).status,
    );
  assert.deepEqual(statuses, [...Array(10).fill(401), 429]);
});

test("SEC-06 CORS exacto y CSRF rechazan orígenes y tokens manipulados", async () => {
  const origin = context.config.origins[0];
  const allowed = await request(context.app)
    .get("/api/v1/catalog")
    .set("Origin", origin);
  assert.equal(allowed.headers["access-control-allow-origin"], origin);
  assert.equal(allowed.headers["access-control-allow-credentials"], "true");
  for (const foreign of [
    "https://attacker.invalid",
    `${origin}.attacker.invalid`,
    "null",
  ]) {
    const response = await request(context.app)
      .get("/api/v1/catalog")
      .set("Origin", foreign);
    assert.equal(response.headers["access-control-allow-origin"], undefined);
    assert.equal(
      (
        await buyer.agent
          .patch("/api/v1/me")
          .set("Origin", foreign)
          .set("X-CSRF-Token", buyer.csrf)
          .send({})
      ).status,
      403,
    );
  }
  assert.equal((await buyer.agent.patch("/api/v1/me").send({})).status, 403);
  for (const token of [undefined, "bad", seller.csrf, "0".repeat(64)]) {
    let call = buyer.agent.patch("/api/v1/me").set("Origin", origin);
    if (token) call = call.set("X-CSRF-Token", token);
    const response = await call.send({});
    assert.equal(response.status, 403);
    assert.equal(response.body.error.code, "CSRF_INVALID");
  }
});

test("SEC-07 SQLi y mass assignment no alteran datos ni elevan privilegios", async () => {
  const item = await createTestListing(context, seller);
  const injected = await request(context.app)
    .get("/api/v1/listings")
    .query({ q: "' OR 1=1; DROP TABLE users;--" });
  assert.equal(injected.status, 200);
  assert.equal(injected.body.total, 0);
  assert.equal(
    (await request(context.app).get("/api/v1/listings/not-a-uuid")).status,
    400,
  );
  const profile = {
    name: "Usuario de prueba",
    career: "Mecatrónica",
    semester: 5,
  };
  for (const field of [
    "role",
    "verified_at",
    "suspended",
    "id",
    "email",
    "password_hash",
  ]) {
    assert.equal(
      (await buyer.send("patch", "/me", { ...profile, [field]: "admin" }))
        .status,
      400,
    );
  }
  assert.equal((await buyer.send("get", "/admin/overview")).status, 403);
  assert.equal(
    (await buyer.send("delete", `/listings/${item.id}`)).status,
    403,
  );
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${item.id}`)).status,
    200,
  );
});

test("SEC-08 respuestas públicas no exponen correo hashes ni tokens", async () => {
  const item = await createTestListing(context, seller);
  for (const route of [
    `/api/v1/users/${seller.user.id}`,
    `/api/v1/listings/${item.id}`,
    "/api/v1/listings",
  ]) {
    const response = await request(context.app).get(route);
    assert.equal(response.status, 200);
    assert.doesNotMatch(
      JSON.stringify(response.body),
      /password_hash|student_hash|token_hash|csrfToken|student-security-seller@campus\.test/,
    );
  }
  assert.equal(
    (await request(context.app).get("/api/v1/admin/overview")).status,
    401,
  );
  assert.equal(
    (await request(context.app).get("/api/v1/conversations")).status,
    401,
  );
});

test("SEC-09 subida normaliza contenido y elimina metadatos sin usar rutas del cliente", async () => {
  const buffer = await sharp({
    create: { width: 12, height: 12, channels: 3, background: "#fff" },
  })
    .withMetadata({ exif: { IFD0: { Copyright: "SECURITY_PROBE" } } })
    .jpeg()
    .toBuffer();
  const image = await seller.send("post", "/uploads").attach("image", buffer, {
    filename: "../../safe.jpg",
    contentType: "image/jpeg",
  });
  assert.equal(image.status, 201);
  assert.equal((await request(context.app).get(image.body.url)).status, 404);
  assert.equal((await buyer.agent.get(image.body.url)).status, 404);
  const download = await seller.agent.get(image.body.url);
  assert.equal(download.status, 200);
  const metadata = await sharp(download.body).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
  const row = (
    await context.db.query(
      "SELECT object_key FROM listing_images WHERE id=$1",
      [image.body.id],
    )
  ).rows[0];
  assert.match(row.object_key, /^[a-f0-9-]{36}\.webp$/);
  const oversized = await sharp({
    create: { width: 5000, height: 5000, channels: 3, background: "#fff" },
  })
    .png()
    .toBuffer();
  assert.equal(
    (
      await seller.send("post", "/uploads").attach("image", oversized, {
        filename: "large.png",
        contentType: "image/png",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await seller
        .send("post", "/uploads")
        .attach("image", Buffer.from('<svg onload="alert(1)"/>'), {
          filename: "fake.png",
          contentType: "image/png",
        })
    ).status,
    400,
  );
});

test("SEC-10 rutas archivos secretos y enlaces externos no se resuelven como recursos", async () => {
  for (const id of [
    "%2e%2e%2f.env",
    "file%3A%2F%2F%2Fetc%2Fpasswd",
    "http%3A%2F%2F127.0.0.1%2Fsecret",
  ]) {
    const response = await request(context.app).get(`/api/v1/images/${id}`);
    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, "VALIDATION_ERROR");
  }
  for (const route of ["/.env", "/backend/.env", "/.git/config"]) {
    const response = await request(context.app).get(route);
    assert.doesNotMatch(
      response.text || "",
      /DATABASE_URL=|APP_SECRET=|\[remote "origin"\]/,
    );
  }
});

test("SEC-11 errores JSON y fallos internos devuelven mensajes seguros", async () => {
  const malformed = await request(context.app)
    .post("/api/v1/auth/login")
    .set("Origin", context.config.origins[0])
    .set("Content-Type", "application/json")
    .send('{"email":');
  assert.equal(malformed.status, 400);
  const oversized = await request(context.app)
    .post("/api/v1/auth/login")
    .set("Origin", context.config.origins[0])
    .send({ email: "x".repeat(70000) });
  assert.equal(oversized.status, 413);
  const app = createApp({
    db: {
      async query() {
        throw new Error("SYNTHETIC_PRIVATE_DETAIL");
      },
    },
    config: context.config,
    mailer: context.mailer,
  });
  const failed = await request(app).get("/api/v1/health");
  assert.equal(failed.status, 500);
  assert.equal(failed.body.error.code, "INTERNAL_ERROR");
  assert.doesNotMatch(failed.text, /SYNTHETIC_PRIVATE_DETAIL|Error:|at /);
  assert.match(failed.headers["x-request-id"], /^[a-f0-9-]{36}$/);
});

test("SEC-12 cookie de producción expira y sesiones nuevas no reutilizan tokens", async () => {
  const app = createApp({
    db: context.db,
    config: { ...context.config, production: true },
    mailer: context.mailer,
  });
  const login = () =>
    request(app)
      .post("/api/v1/auth/login")
      .set("Origin", context.config.origins[0])
      .send({
        email: registration("security-buyer").email,
        password: registration("security-buyer").password,
      });
  const first = await login();
  const second = await login();
  assert.equal(first.status, 200);
  const cookie = first.headers["set-cookie"][0];
  assert.match(cookie, /; HttpOnly/);
  assert.match(cookie, /; Secure/);
  assert.match(cookie, /; SameSite=Lax/);
  assert.match(cookie, /Max-Age=28800/);
  assert.notEqual(
    first.headers["set-cookie"][0].split(";")[0],
    second.headers["set-cookie"][0].split(";")[0],
  );
  await context.db.query(
    "UPDATE sessions SET expires_at=now()-interval '1 second' WHERE user_id=$1",
    [buyer.user.id],
  );
  assert.equal(
    (
      await request(app)
        .get("/api/v1/auth/session")
        .set("Cookie", cookie.split(";")[0])
    ).body.user,
    null,
  );
});

test("SEC-13 token de recuperación concurrente se consume una sola vez", async () => {
  const input = registration("token-race");
  await request(context.app)
    .post("/api/v1/auth/register")
    .set("Origin", context.config.origins[0])
    .send(input);
  await request(context.app)
    .post("/api/v1/auth/password-reset")
    .set("Origin", context.config.origins[0])
    .send({ email: input.email });
  const token = context.mail.findLast((mail) => mail.to === input.email).token;
  const statuses = await Promise.all(
    Array.from(
      { length: 3 },
      async () =>
        (
          await request(context.app)
            .post("/api/v1/auth/password-reset/confirm")
            .set("Origin", context.config.origins[0])
            .send({ token, password: "Nueva contraseña concurrente 2026!" })
        ).status,
    ),
  );
  assert.deepEqual(statuses.sort(), [200, 400, 400]);
});

test("SEC-14 cabeceras CSP HSTS nosniff y bloqueo de marcos están presentes", async () => {
  const response = await request(context.app).get("/api/v1/health");
  assert.match(
    response.headers["content-security-policy"],
    /script-src 'self'/,
  );
  assert.match(
    response.headers["content-security-policy"],
    /object-src 'none'/,
  );
  assert.match(response.headers["strict-transport-security"], /max-age=/);
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(response.headers["x-frame-options"], "SAMEORIGIN");
  assert.equal(response.headers["referrer-policy"], "no-referrer");
  assert.equal(response.headers["cache-control"], "no-store");
  assert.equal(response.headers["x-powered-by"], undefined);
});

test("SEC-15 login correcto no consume el cupo de fallos por cuenta", async () => {
  const app = createApp({
    db: context.db,
    config: { ...context.config, testMode: false, trustProxy: 1 },
    mailer: context.mailer,
  });
  const input = registration("security-seller");
  for (let i = 1; i <= 11; i++) {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("Origin", context.config.origins[0])
      .set("X-Forwarded-For", `198.51.100.${i}`)
      .send({ email: input.email, password: input.password });
    assert.equal(response.status, 200);
  }
});

test("SEC-16 dominio itesa.edu.mx se compara completo sin verificar cuentas automáticamente", async () => {
  const app = createApp({
    db: context.db,
    config: { ...context.config, domains: ["itesa.edu.mx"] },
    mailer: context.mailer,
  });
  const register = (email) =>
    request(app)
      .post("/api/v1/auth/register")
      .set("Origin", context.config.origins[0])
      .send({ ...registration("itesa-audit"), email });
  for (const email of [
    "audit@itesa.edu.mx.attacker.invalid",
    "audit@evilitesa.edu.mx",
    "audit@sub.itesa.edu.mx",
    "audit@gmail.com",
  ]) {
    const response = await register(email);
    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, "INSTITUTIONAL_DOMAIN");
  }
  assert.equal(
    (await register("  AUDIT-SYNTHETIC@ITESA.EDU.MX  ")).status,
    202,
  );
  const row = (
    await context.db.query("SELECT verified_at FROM users WHERE email=$1", [
      "audit-synthetic@itesa.edu.mx",
    ])
  ).rows[0];
  assert.equal(row.verified_at, null);
});
