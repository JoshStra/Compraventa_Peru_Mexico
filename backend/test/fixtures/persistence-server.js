import { createDatabase } from "../../src/repositories/database.js";
import { createApp } from "../../src/app.js";
if (!process.env.CT_PROBE_CONFIG || !process.send)
  throw new Error("Solo desde prueba de persistencia.");
const config = JSON.parse(process.env.CT_PROBE_CONFIG);
if (!["localhost", "127.0.0.1"].includes(new URL(config.databaseUrl).hostname))
  throw new Error("PostgreSQL local requerido.");
const db = createDatabase(config.databaseUrl);
const app = createApp({ db, config });
const server = app.listen(0, "127.0.0.1", () =>
  process.send({ port: server.address().port }),
);
process.on("message", (message) => {
  if (message.type === "shutdown")
    server.close(async () => {
      await db.close();
      process.exit(0);
    });
});
