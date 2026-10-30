import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/repositories/database.js";
import { migrate } from "../src/models/migrate.js";
import { createApp } from "../src/app.js";

const config = loadConfig({ ...process.env, NODE_ENV: "test" });
const db = createDatabase(config.databaseUrl);
after(() => db.close());
test("migraciones PostgreSQL idempotentes y catálogo inicial", async () => {
  await migrate(db);
  await migrate(db);
  assert.equal(
    (await db.query("SELECT count(*)::int AS total FROM schema_migrations"))
      .rows[0].total,
    1,
  );
  const response = await request(createApp({ db, config })).get(
    "/api/v1/catalog",
  );
  assert.equal(response.status, 200);
  assert.equal(response.body.categories.length, 4);
});
test("health confirma la conexión real y no expone secretos", async () => {
  const response = await request(createApp({ db, config })).get(
    "/api/v1/health",
  );
  assert.equal(response.status, 200);
  assert.equal(response.body.database, "connected");
  assert.equal(response.headers["x-powered-by"], undefined);
});
test("rollback conserva la integridad cuando falla una escritura", async () => {
  await assert.rejects(
    db.transaction(async (client) => {
      await client.query(
        "INSERT INTO categories(name) VALUES('Rollback test')",
      );
      throw new Error("intentional");
    }),
  );
  assert.equal(
    (
      await db.query(
        "SELECT count(*)::int AS total FROM categories WHERE name='Rollback test'",
      )
    ).rows[0].total,
    0,
  );
});
