// Run through stdin inside the app container. Uses only its local demo SMTP
// service and a disposable schema; never prints tokens or passwords.
import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { once } from "node:events";
import { createDatabase } from "./backend/src/repositories/database.js";
import { migrate } from "./backend/src/models/migrate.js";
import { loadConfig } from "./backend/src/config.js";
import { createApp } from "./backend/src/app.js";

let root,
  db,
  server,
  schemaCreated = false,
  stage = "configuration";
const schema = `test_mail_${randomUUID().replaceAll("-", "")}`;
const messageIds = new Set();
const checks = [];
const mailbox = "http://mailpit:8025";
const passed = (id) => checks.push({ id, state: "passed" });
async function inbox(route, options = {}) {
  const response = await fetch(mailbox + route, options);
  assert.ok(response.ok);
  return response.json();
}
async function captured(address) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const result = await inbox("/api/v1/messages");
    const candidate = result.messages.find(
      (item) =>
        item.To.some((to) => to.Address === address) &&
        item.Subject.includes("Recupera") &&
        !messageIds.has(item.ID),
    );
    if (candidate) {
      messageIds.add(candidate.ID);
      const message = await inbox(`/api/v1/message/${candidate.ID}`);
      assert.match(message.Subject, /^\[DEMO LOCAL\]/);
      assert.match(message.Text, /No se envía a ITESA/);
      const link = message.Text.match(
        /Abre este enlace: (https?:\/\/[^\s]+)/,
      )?.[1];
      const token = new URLSearchParams(new URL(link).hash.slice(1)).get(
        "reset",
      );
      assert.ok(typeof token === "string" && /^[a-f0-9]{64}$/.test(token));
      return token;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("CAPTURE_TIMEOUT");
}
try {
  const config = loadConfig();
  assert.equal(config.mailDelivery.mode, "local_demo");
  assert.equal(config.smtp.host, "mailpit");
  assert.equal(new URL(config.databaseUrl).hostname, "db");
  root = createDatabase(config.databaseUrl);
  const snapshot = async () =>
    createHash("sha256")
      .update(
        JSON.stringify(
          (
            await root.query(
              "SELECT id,role,verified_at,suspended FROM public.users ORDER BY id",
            )
          ).rows,
        ),
      )
      .digest("hex");
  const before = await snapshot();
  assert.match(schema, /^test_mail_[a-f0-9]{32}$/);
  await root.query(`CREATE SCHEMA "${schema}"`);
  schemaCreated = true;
  const url = new URL(config.databaseUrl);
  url.searchParams.set("options", `-c search_path=${schema}`);
  db = createDatabase(url.href);
  await migrate(db);
  server = createApp({ db, config: { ...config, testMode: true } }).listen(
    0,
    "127.0.0.1",
  );
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  async function call(route, data, session) {
    const response = await fetch(base + route, {
      method: data ? "POST" : "GET",
      headers: {
        Origin: config.origins[0],
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...(session
          ? { Cookie: session.cookie, "X-CSRF-Token": session.csrf }
          : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    return { response, body: await response.json() };
  }
  const nonce = randomUUID().slice(0, 12).replaceAll("-", "");
  const account = {
    name: "Prueba descartable de correo local",
    email: `demo-probe-${nonce}@itesa.edu.mx`,
    studentId: `DEMO${nonce}`,
    password: randomBytes(24).toString("base64url"),
    career: (
      await db.query(
        "SELECT name FROM careers WHERE active ORDER BY name LIMIT 1",
      )
    ).rows[0].name,
    semester: 5,
  };
  stage = "registration";
  const registration = await call("/auth/register", account);
  assert.equal(registration.response.status, 202);
  assert.equal(registration.body.emailDeliveryMode, "local_demo");
  assert.equal(
    (
      await db.query("SELECT verified_at FROM users WHERE email=$1", [
        account.email,
      ])
    ).rows[0].verified_at,
    null,
  );
  assert.ok(
    !(await inbox("/api/v1/messages")).messages.some((item) =>
      item.To.some((to) => to.Address === account.email),
    ),
  );
  passed("registration_without_confirmation_or_email");
  const login = await call("/auth/login", {
    email: account.email,
    password: account.password,
  });
  assert.equal(login.response.status, 200);
  const session = {
    cookie: login.response.headers.get("set-cookie").split(";")[0],
    csrf: login.body.csrfToken,
  };
  stage = "publication";
  const catalog = await call("/catalog");
  const listing = await call(
    "/listings",
    {
      title: "Material de prueba sin confirmación",
      description:
        "Material sintético para comprobar el registro sin confirmación de correo.",
      location: "Biblioteca del campus",
      modality: "donation",
      price: 0,
      condition: "good",
      career: account.career,
      categoryId: catalog.body.categories[0].id,
      imageIds: [],
    },
    session,
  );
  assert.equal(listing.response.status, 201);
  passed("publication_without_confirming_email");
  stage = "recovery";
  const recovery = await call("/auth/password-reset", { email: account.email });
  assert.equal(recovery.response.status, 200);
  const previous = await captured(account.email);
  await call("/auth/password-reset", { email: account.email });
  const reset = await captured(account.email);
  const newPassword = randomBytes(24).toString("base64url");
  assert.notEqual(previous, reset);
  assert.equal(
    (
      await call("/auth/password-reset/confirm", {
        token: previous,
        password: newPassword,
      })
    ).response.status,
    400,
  );
  assert.equal(
    (
      await call("/auth/password-reset/confirm", {
        token: reset,
        password: newPassword,
      })
    ).response.status,
    200,
  );
  assert.equal(
    (
      await call("/auth/password-reset/confirm", {
        token: reset,
        password: newPassword,
      })
    ).response.status,
    400,
  );
  passed("recovery_links_are_replaced_and_single_use");
  assert.equal(
    (await call("/auth/session", undefined, session)).body.user,
    null,
  );
  passed("recovery_delivered_by_smtp_and_old_session_revoked");
  stage = "preservation";
  assert.equal(await snapshot(), before);
  passed("existing_users_and_admin_verification_unchanged");
} catch {
  process.exitCode = 1;
} finally {
  try {
    if (messageIds.size) {
      const response = await fetch(mailbox + "/api/v1/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IDs: [...messageIds] }),
      });
      assert.ok(response.ok);
    }
    if (server) {
      server.closeIdleConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    await db?.close();
    if (schemaCreated) {
      assert.match(schema, /^test_mail_[a-f0-9]{32}$/);
      await root.query(`DROP SCHEMA "${schema}" CASCADE`);
    }
    await root?.close();
  } catch {
    process.exitCode = 1;
    stage = "cleanup";
  }
  console.log(
    JSON.stringify({
      checkedAt: new Date().toISOString(),
      success: !process.exitCode,
      stage: process.exitCode ? stage : "complete",
      checks,
      disposableSchemaRemoved: schemaCreated && !process.exitCode,
      tokensOrPasswordsPrinted: false,
    }),
  );
}
