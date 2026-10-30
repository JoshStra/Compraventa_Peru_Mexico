import { randomUUID } from "node:crypto";
import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/repositories/database.js";
import { migrate } from "../src/models/migrate.js";
import { createApp } from "../src/app.js";
import request from "supertest";
import path from "node:path";
import { readdir, unlink, rmdir } from "node:fs/promises";
import { backendRoot } from "../src/config.js";

export async function testContext() {
  const config = loadConfig({
    ...process.env,
    NODE_ENV: "test",
    ALLOWED_EMAIL_DOMAINS: "campus.test",
  });
  const url = new URL(config.databaseUrl);
  if (!["127.0.0.1", "localhost"].includes(url.hostname))
    throw new Error(
      "Las pruebas necesitan PostgreSQL local, nunca producción.",
    );
  const schema = `test_${randomUUID().replaceAll("-", "")}`;
  config.storagePath = path.resolve(backendRoot, ".data", schema);
  const root = createDatabase(config.databaseUrl);
  await root.query(`CREATE SCHEMA "${schema}"`);
  url.searchParams.set("options", `-c search_path=${schema}`);
  const db = createDatabase(url.href);
  await migrate(db);
  const mail = [];
  const mailer = {
    available: true,
    async send(message) {
      mail.push(message);
      return true;
    },
  };
  const app = createApp({ db, config, mailer });
  return {
    db,
    app,
    config,
    mail,
    mailer,
    async close() {
      await db.close();
      await root.query(`DROP SCHEMA "${schema}" CASCADE`);
      await root.close();
      if (
        path.dirname(config.storagePath) !==
          path.resolve(backendRoot, ".data") ||
        !/^test_[a-f0-9]+$/.test(path.basename(config.storagePath))
      )
        throw new Error("Ruta de pruebas no válida");
      for (const file of await readdir(config.storagePath).catch(() => []))
        await unlink(path.join(config.storagePath, file));
      await rmdir(config.storagePath).catch((error) => {
        if (error.code !== "ENOENT") throw error;
      });
    },
  };
}
export const registration = (suffix = "a") => ({
  name: `Estudiante ${suffix}`,
  email: `student-${suffix}@campus.test`,
  studentId: `TEST-${suffix}`,
  password: "Una contraseña de prueba 2026!",
  career: "Mecatrónica",
  semester: 5,
});

export async function createTestUser(
  context,
  suffix,
  { verified = true } = {},
) {
  const input = registration(suffix);
  const origin = context.config.origins[0];
  const registered = await request(context.app)
    .post("/api/v1/auth/register")
    .set("Origin", origin)
    .send(input);
  if (registered.status !== 201)
    throw new Error(`Fixture registration failed: ${registered.status}`);
  if (verified) {
    const mail = context.mail.findLast(
      (item) => item.to === input.email && item.purpose === "verify",
    );
    await request(context.app)
      .post("/api/v1/auth/verify")
      .set("Origin", origin)
      .send({ token: mail.token });
  }
  const agent = request.agent(context.app);
  const login = await agent
    .post("/api/v1/auth/login")
    .set("Origin", origin)
    .send({ email: input.email, password: input.password });
  const send = (method, route, body) => {
    const call = agent[method](`/api/v1${route}`)
      .set("Origin", origin)
      .set("X-CSRF-Token", login.body.csrfToken);
    return body === undefined ? call : call.send(body);
  };
  return { agent, user: login.body.user, csrf: login.body.csrfToken, send };
}

export async function createTestListing(context, user, overrides = {}) {
  const catalog = (await request(context.app).get("/api/v1/catalog")).body;
  const input = {
    title: "Calculadora científica Casio",
    description: "Calculadora funcionando con funda y batería incluida.",
    location: "Biblioteca del campus",
    modality: "sale",
    condition: "good",
    price: 350.5,
    career: "Mecatrónica",
    categoryId: catalog.categories[0].id,
    imageIds: [],
    ...overrides,
  };
  const response = await user.send("post", "/listings", input);
  if (response.status !== 201)
    throw new Error("Fixture listing failed: " + response.status);
  return response.body.item;
}
