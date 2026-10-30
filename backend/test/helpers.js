import { randomUUID } from "node:crypto";
import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/repositories/database.js";
import { migrate } from "../src/models/migrate.js";
import { createApp } from "../src/app.js";

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
