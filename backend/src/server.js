import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createDatabase } from "./repositories/database.js";
import { migrate } from "./models/migrate.js";

const config = loadConfig();
const db = createDatabase(config.databaseUrl);
await migrate(db);
const server = createApp({ db, config }).listen(config.port, config.host, () =>
  console.log(
    JSON.stringify({
      event: "server_started",
      port: config.port,
      url: config.publicUrl,
    }),
  ),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => {
    server.close(async () => {
      await db.close();
      process.exit(0);
    });
  });
