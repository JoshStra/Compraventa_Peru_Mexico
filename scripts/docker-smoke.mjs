import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import pg from "pg";

const project = `campustrade-smoke-${randomUUID().slice(0, 8)}`;
const directory = path.resolve("tmp");
fs.mkdirSync(directory, { recursive: true });
const envFile = path.join(directory, `${project}.env`);
const evidenceFile =
  process.env.DOCKER_EVIDENCE_PATH ||
  path.join(directory, "docker-smoke-result.json");
const freePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
const appPort = await freePort(),
  dbPort = await freePort();
const settings = {
  POSTGRES_PASSWORD: randomBytes(32).toString("hex"),
  APP_DB_PASSWORD: randomBytes(32).toString("hex"),
  APP_SECRET: randomBytes(32).toString("hex"),
  POSTGRES_DB: "campustrade_test",
  POSTGRES_PORT: String(dbPort),
  CAMPUS_PORT: String(appPort),
};
fs.writeFileSync(
  envFile,
  Object.entries(settings)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n") + "\n",
  { mode: 0o600 },
);
const docker = (args) =>
  execFileSync("docker", args, {
    encoding: "utf8",
    maxBuffer: 4_000_000,
    env: { ...process.env, ...settings },
  });
const compose = (args) =>
  docker(["compose", "-p", project, "--env-file", envFile, ...args]);
const origin = `http://127.0.0.1:${appPort}`;
const checks = [];
let testedImage;
let stage = "startup",
  db,
  started = false;
function passed(id, description) {
  checks.push({
    id,
    description,
    state: "passed",
    at: new Date().toISOString(),
  });
}
async function call(route, { actor, method = "GET", body, csrf } = {}) {
  const headers = { Origin: origin, Connection: "close" };
  if (actor) {
    headers.Cookie = actor.cookie;
    headers["X-CSRF-Token"] = csrf ?? actor.csrf;
  }
  const form = body instanceof FormData;
  if (body && !form) headers["Content-Type"] = "application/json";
  const response = await fetch(`${origin}/api/v1${route}`, {
    method,
    headers,
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });
  const data = await response.json();
  return { response, data };
}
async function person(suffix) {
  const input = {
    name: `Docker prueba ${suffix}`,
    email: `docker-${suffix}-${project}@itesa.edu.mx`,
    studentId: `DOCKER-${suffix}-${project.slice(-8)}`,
    career: "Mecatrónica",
    semester: 5,
    password: randomBytes(24).toString("hex"),
  };
  const first = await call("/auth/register", { method: "POST", body: input });
  const duplicate = await call("/auth/register", {
    method: "POST",
    body: input,
  });
  assert.equal(first.response.status, 202);
  assert.deepEqual(duplicate.data, first.data);
  assert.equal(duplicate.response.status, 202);
  const login = await call("/auth/login", {
    method: "POST",
    body: { email: input.email, password: input.password },
  });
  assert.equal(login.response.status, 200);
  const cookie = login.response.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/);
  return {
    user: login.data.user,
    csrf: login.data.csrfToken,
    cookie: cookie.split(";")[0],
  };
}
try {
  started = true;
  compose(["up", "-d", "--no-build", "--wait", "--wait-timeout", "90"]);
  assert.equal((await call("/health")).data.database, "connected");
  assert.match(
    await (await fetch(origin)).text(),
    /<title>CampusTrade<\/title>/,
  );
  passed(
    "DOCKER-01",
    "API y frontend compilado responden en contenedores recién creados",
  );

  stage = "database-role";
  db = new pg.Pool({
    host: "127.0.0.1",
    port: dbPort,
    database: settings.POSTGRES_DB,
    user: "campustrade_app",
    password: settings.APP_DB_PASSWORD,
    max: 1,
  });
  const role = (
    await db.query(
      "SELECT rolsuper,rolcreatedb,rolcreaterole,rolbypassrls FROM pg_roles WHERE rolname=current_user",
    )
  ).rows[0];
  assert.ok(Object.values(role).every((value) => value === false));
  assert.equal(
    (await db.query("SELECT count(*)::int AS count FROM schema_migrations"))
      .rows[0].count,
    2,
  );
  passed(
    "DOCKER-02",
    "Inicialización automática y rol de aplicación sin privilegios administrativos",
  );

  stage = "authentication";
  const seller = await person("seller"),
    buyer = await person("buyer");
  assert.equal(seller.user.verified, false);
  assert.equal(
    (await call("/listings", { method: "POST", actor: seller, body: {} }))
      .response.status,
    403,
  );
  passed(
    "DOCKER-03",
    "Registro genérico, cookie y restricción de cuentas sin verificar",
  );
  // Only this uniquely named disposable database receives synthetic verification fixtures.
  assert.equal(settings.POSTGRES_DB, "campustrade_test");
  await db.query(
    "UPDATE users SET verified_at=now() WHERE id=ANY($1::uuid[])",
    [[seller.user.id, buyer.user.id]],
  );
  const catalog = (await call("/catalog")).data;
  assert.deepEqual(catalog.emailDomains, ["itesa.edu.mx"]);
  const form = new FormData();
  form.set(
    "image",
    new Blob([fs.readFileSync("frontend/e2e/fixtures/article.png")], {
      type: "image/png",
    }),
    "article.png",
  );
  const uploaded = await call("/uploads", {
    method: "POST",
    actor: seller,
    body: form,
  });
  assert.equal(uploaded.response.status, 201);
  const input = {
    title: "Artículo de prueba Docker",
    description:
      "Material sintético para comprobar Docker y almacenamiento persistente.",
    location: "Biblioteca del campus",
    categoryId: catalog.categories[0].id,
    career: "Mecatrónica",
    modality: "sale",
    condition: "good",
    price: 25.5,
    imageIds: [uploaded.data.id],
  };
  const created = await call("/listings", {
    method: "POST",
    actor: seller,
    body: input,
  });
  assert.equal(created.response.status, 201);
  const id = created.data.item.id;
  const imageURL = `${origin}${uploaded.data.url}`;
  const image = await fetch(imageURL);
  assert.equal(image.status, 200);
  const imageHash = createHash("sha256")
    .update(Buffer.from(await image.arrayBuffer()))
    .digest("hex");
  passed(
    "DOCKER-04",
    "Publicación e imagen real procesada con Sharp y guardada en volumen",
  );

  stage = "authorization";
  assert.equal(
    (
      await call(`/listings/${id}`, {
        method: "PATCH",
        actor: buyer,
        body: input,
      })
    ).response.status,
    403,
  );
  assert.equal(
    (
      await call(`/listings/${id}`, {
        method: "PATCH",
        actor: seller,
        csrf: "wrong",
        body: input,
      })
    ).response.status,
    403,
  );
  assert.equal(
    (
      await call(`/listings/${id}`, {
        method: "PATCH",
        actor: seller,
        body: { ...input, title: "Artículo editado en Docker" },
      })
    ).response.status,
    200,
  );
  passed("DOCKER-05", "Edición propia y bloqueo de terceros y CSRF incorrecto");

  stage = "messages-operations";
  const thread = await call("/conversations", {
    method: "POST",
    actor: buyer,
    body: { listingId: id },
  });
  assert.equal(thread.response.status, 201);
  assert.equal(
    (
      await call(`/conversations/${thread.data.id}/messages`, {
        method: "POST",
        actor: buyer,
        body: { body: "Prueba de mensajería persistente en Docker." },
      })
    ).response.status,
    201,
  );
  const operation = await call("/operations", {
    method: "POST",
    actor: buyer,
    body: { listingId: id },
  });
  assert.equal(operation.response.status, 201);
  for (const status of ["accepted", "completed"])
    assert.equal(
      (
        await call(`/operations/${operation.data.operation.id}`, {
          method: "PATCH",
          actor: seller,
          body: { status },
        })
      ).response.status,
      200,
    );
  assert.equal(
    (
      await call(`/operations/${operation.data.operation.id}/ratings`, {
        method: "POST",
        actor: buyer,
        body: { score: 5, comment: "Flujo sintético completado en Docker." },
      })
    ).response.status,
    201,
  );
  passed(
    "DOCKER-06",
    "Mensajes, reserva, venta y calificación con dos cuentas sintéticas",
  );

  stage = "container-isolation";
  const container = compose(["ps", "-q", "app"]).trim();
  testedImage = docker(["inspect", "--format", "{{.Image}}", container]).trim();
  const isolation = JSON.parse(
    docker(["inspect", "--format", "{{json .Config.User}}", container]),
  );
  assert.equal(isolation, "node");
  assert.equal(
    docker([
      "inspect",
      "--format",
      "{{.HostConfig.ReadonlyRootfs}}",
      container,
    ]).trim(),
    "true",
  );
  const excluded = JSON.parse(
    compose([
      "exec",
      "-T",
      "app",
      "node",
      "-e",
      "const fs=require('node:fs');console.log(JSON.stringify(['/app/.env','/app/.git','/app/backend/.env','/app/backend/test','/app/backend/.data/deployment'].map(p=>fs.existsSync(p))))",
    ]),
  );
  assert.ok(excluded.every((value) => value === false));
  passed(
    "DOCKER-07",
    "Contenedor sin root, sistema de archivos de solo lectura y sin secretos ni fixtures de host",
  );

  stage = "persistence";
  await db.end();
  db = null;
  compose([
    "up",
    "-d",
    "--no-build",
    "--force-recreate",
    "--wait",
    "--wait-timeout",
    "90",
  ]);
  const persistedSession = await call("/auth/session", { actor: seller });
  assert.equal(persistedSession.response.status, 200);
  assert.ok(persistedSession.data.user, "PERSISTED_SESSION_REQUIRED");
  assert.equal(persistedSession.data.user.id, seller.user.id);
  assert.equal(
    (await call(`/listings/${id}`)).data.item.title,
    "Artículo editado en Docker",
  );
  const restoredImage = await fetch(imageURL);
  assert.equal(restoredImage.status, 200);
  assert.equal(
    createHash("sha256")
      .update(Buffer.from(await restoredImage.arrayBuffer()))
      .digest("hex"),
    imageHash,
  );
  assert.equal(
    (await call(`/conversations/${thread.data.id}/messages`, { actor: seller }))
      .data.total,
    1,
  );
  passed(
    "DOCKER-08",
    "Recrear API y PostgreSQL conserva sesión, artículo, mensajes e imagen exacta",
  );

  stage = "withdrawal";
  assert.equal(
    (await call(`/listings/${id}`, { method: "DELETE", actor: seller }))
      .response.status,
    200,
  );
  assert.equal((await call(`/listings/${id}`)).response.status, 404);
  assert.equal((await fetch(imageURL)).status, 404);
  assert.equal(
    (await call("/operations", { actor: seller })).data.items.length,
    1,
  );
  passed(
    "DOCKER-09",
    "Retiro de publicación e imagen pública sin borrar historial de operación",
  );
} catch (error) {
  checks.push({
    id: "FAIL",
    state: "failed",
    stage,
    code: error.code || error.name,
    networkFailure: error.message === "fetch failed",
    causeCode: error.cause?.code,
    at: new Date().toISOString(),
  });
  process.exitCode = 1;
} finally {
  await db?.end();
  if (!/^campustrade-smoke-[a-f0-9]{8}$/.test(project))
    throw new Error("INVALID_TEST_PROJECT");
  if (started) {
    try {
      compose(["down", "--volumes", "--remove-orphans"]);
    } catch {
      checks.push({ id: "CLEANUP", state: "failed" });
      process.exitCode = 1;
    }
  }
  fs.unlinkSync(envFile);
  fs.mkdirSync(path.dirname(evidenceFile), { recursive: true });
  const summary = {
    image: testedImage,
    checkedAt: new Date().toISOString(),
    testProject: project,
    passed: checks.filter((c) => c.state === "passed").length,
    failed: checks.filter((c) => c.state === "failed").length,
    disposableVolumesRemoved: !checks.some((c) => c.id === "CLEANUP"),
    checks,
  };
  fs.writeFileSync(evidenceFile, JSON.stringify(summary, null, 2) + "\n");
  console.log(JSON.stringify(summary, null, 2));
}
