import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { createDatabase } from "../repositories/database.js";
import { loadConfig } from "../config.js";

export async function migrate(db) {
  const directory = new URL("../../migrations/", import.meta.url);
  await db.transaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(72130904)");
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    for (const name of (await readdir(directory))
      .filter((value) => value.endsWith(".sql"))
      .sort()) {
      const sql = await readFile(new URL(name, directory), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const applied = (
        await client.query(
          "SELECT checksum FROM schema_migrations WHERE name=$1",
          [name],
        )
      ).rows[0];
      if (applied && applied.checksum !== checksum)
        throw new Error(`La migración ${name} cambió después de aplicarse.`);
      if (applied) continue;
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations(name,checksum) VALUES($1,$2)",
        [name, checksum],
      );
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const db = createDatabase(loadConfig().databaseUrl);
  try {
    await migrate(db);
    console.log("Migraciones verificadas.");
  } finally {
    await db.close();
  }
}
