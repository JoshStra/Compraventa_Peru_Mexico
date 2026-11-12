import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

const production = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://example.invalid/campustrade",
  APP_SECRET: "configuration-test-only-at-least-32-characters",
  STORAGE_DRIVER: "s3",
  S3_ENDPOINT: "https://storage.example.invalid",
  S3_REGION: "us-east-1",
  S3_BUCKET: "campustrade",
  S3_ACCESS_KEY_ID: "test-only",
  S3_SECRET_ACCESS_KEY: "test-only",
  ALLOWED_EMAIL_DOMAINS: "itesa.edu.mx",
};
test("Render proporciona el origen HTTPS inicial sin adivinar el dominio asignado", () => {
  const config = loadConfig({
    ...production,
    RENDER_EXTERNAL_URL: "https://assigned-name.onrender.com",
  });
  assert.equal(config.publicUrl, "https://assigned-name.onrender.com");
  assert.deepEqual(config.origins, ["https://assigned-name.onrender.com"]);
  assert.deepEqual(config.domains, ["itesa.edu.mx"]);
});
test("PUBLIC_URL y CORS_ORIGINS explícitos prevalecen sobre el dominio de Render", () => {
  const config = loadConfig({
    ...production,
    RENDER_EXTERNAL_URL: "https://assigned-name.onrender.com",
    PUBLIC_URL: "https://campustrade.example.org",
    CORS_ORIGINS: "https://campustrade.example.org,https://preview.example.org",
  });
  assert.equal(config.publicUrl, "https://campustrade.example.org");
  assert.deepEqual(config.origins, [
    "https://campustrade.example.org",
    "https://preview.example.org",
  ]);
});
test("la detección de Render no permite HTTP ni orígenes con rutas", () => {
  assert.throws(
    () =>
      loadConfig({
        ...production,
        RENDER_EXTERNAL_URL: "http://assigned-name.onrender.com",
      }),
    /HTTPS/,
  );
  assert.throws(
    () =>
      loadConfig({
        ...production,
        RENDER_EXTERNAL_URL: "https://assigned-name.onrender.com/path",
      }),
    /orígenes exactos/,
  );
});
test("producción sigue rechazando URL ausente y almacenamiento local", () => {
  assert.throws(() => loadConfig(production), /HTTPS/);
  assert.throws(
    () =>
      loadConfig({
        ...production,
        RENDER_EXTERNAL_URL: "https://assigned-name.onrender.com",
        STORAGE_DRIVER: "local",
      }),
    /S3 persistente/,
  );
});

const localMail = {
  ...production,
  NODE_ENV: "development",
  STORAGE_DRIVER: "local",
  PUBLIC_URL: "http://127.0.0.1:3000",
  MAIL_DELIVERY_MODE: "local_demo",
  LOCAL_MAILBOX_URL: "http://127.0.0.1:8025",
  SMTP_HOST: "mailpit",
  SMTP_PORT: "1025",
  MAIL_FROM: "CampusTrade Demo <campustrade@demo.local>",
};

test("el buzón de demostración solo permite SMTP y una interfaz locales", () => {
  const config = loadConfig(localMail);
  assert.equal(config.mailDelivery.mode, "local_demo");
  assert.equal(config.smtp.host, "mailpit");
  assert.equal(config.smtp.port, 1025);
  for (const value of [
    "https://mail.example.org",
    "http://127.0.0.1:8025/?token=x",
    "http://user:password@127.0.0.1:8025",
  ])
    assert.throws(
      () => loadConfig({ ...localMail, LOCAL_MAILBOX_URL: value }),
      /LOCAL_MAILBOX_URL/,
    );
});

test("la demostración rechaza proveedores externos y remitente ausente", () => {
  for (const override of [
    { SMTP_HOST: "smtp.example.org" },
    { RESEND_API_KEY: "test-key" },
    { MAIL_FROM: "" },
  ])
    assert.throws(
      () => loadConfig({ ...localMail, ...override }),
      /SMTP local/,
    );
  assert.throws(
    () => loadConfig({ ...localMail, MAIL_DELIVERY_MODE: "other" }),
    /MAIL_DELIVERY_MODE/,
  );
});

test("la configuración productiva no acepta el correo de demostración", () => {
  assert.throws(
    () =>
      loadConfig({
        ...localMail,
        NODE_ENV: "production",
        PUBLIC_URL: "https://campustrade.example.org",
        STORAGE_DRIVER: "s3",
      }),
    /no se permite en producción/,
  );
});
