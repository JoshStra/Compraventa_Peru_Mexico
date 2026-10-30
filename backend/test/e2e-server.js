import express from "express";
import { testContext } from "./helpers.js";

if (process.env.NODE_ENV !== "test" || !process.env.E2E_TEST_KEY)
  throw new Error("Este servidor solo se ejecuta desde las pruebas E2E.");
process.env.CORS_ORIGINS = "http://127.0.0.1:4180";
process.env.PUBLIC_URL = "http://127.0.0.1:4180";
const context = await testContext();
const app = express();
app.use(express.json());
const guard = (req, res, next) => {
  if (req.get("x-test-key") !== process.env.E2E_TEST_KEY)
    return res.sendStatus(403);
  next();
};
app.get("/__test/mail", guard, (req, res) =>
  res.json({ items: context.mail.filter((item) => item.to === req.query.to) }),
);
app.post("/__test/admin", guard, async (req, res) => {
  if (!String(req.body.email).endsWith("@campus.test"))
    return res.sendStatus(400);
  await context.db.query(
    "UPDATE users SET role='admin' WHERE email=$1 AND verified_at IS NOT NULL",
    [req.body.email],
  );
  res.json({ ok: true });
});
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  server.close(async () => {
    await context.close();
    process.exit(0);
  });
}
app.post("/__test/shutdown", guard, (req, res) => {
  res.json({ ok: true });
  setImmediate(close);
});
app.use(context.app);
const server = app.listen(4180, "127.0.0.1", () =>
  console.log(
    "E2E ready on loopback; isolated PostgreSQL schema; test mail transport.",
  ),
);
for (const signal of ["SIGTERM", "SIGINT"]) process.once(signal, close);
