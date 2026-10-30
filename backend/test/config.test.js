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
