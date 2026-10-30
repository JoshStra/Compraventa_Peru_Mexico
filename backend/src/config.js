import path from "node:path";
import { fileURLToPath } from "node:url";

export const backendRoot = fileURLToPath(new URL("..", import.meta.url));
export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const origins = (
    env.CORS_ORIGINS ||
    "http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:4173"
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const config = {
    production,
    port: Number(env.PORT || 3000),
    host: env.HOST || "127.0.0.1",
    databaseUrl: env.DATABASE_URL,
    secret: env.APP_SECRET,
    origins,
    publicUrl: env.PUBLIC_URL || origins[0],
    domains: (env.ALLOWED_EMAIL_DOMAINS || "")
      .toLowerCase()
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    sessionHours: Number(env.SESSION_HOURS || 8),
    storageDriver: env.STORAGE_DRIVER || "local",
    storagePath: path.resolve(
      env.STORAGE_PATH || path.join(backendRoot, ".data", "images"),
    ),
    s3: {
      region: env.S3_REGION || "auto",
      endpoint: env.S3_ENDPOINT,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    smtp: {
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE === "true",
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
      from: env.MAIL_FROM,
    },
    resend: { key: env.RESEND_API_KEY, from: env.MAIL_FROM },
    trustProxy: Number(env.TRUST_PROXY || 0),
    testMode: env.NODE_ENV === "test",
  };
  if (!config.databaseUrl)
    throw new Error("Falta DATABASE_URL en la configuración del servidor.");
  if (!config.secret || config.secret.length < 32)
    throw new Error(
      "APP_SECRET debe contener al menos 32 caracteres aleatorios.",
    );
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535)
    throw new Error("PORT inválido.");
  if (
    !Number.isFinite(config.sessionHours) ||
    config.sessionHours <= 0 ||
    config.sessionHours > 168
  )
    throw new Error("SESSION_HOURS inválido.");
  for (const origin of origins) {
    if (new URL(origin).origin !== origin)
      throw new Error("CORS_ORIGINS requiere orígenes exactos sin ruta.");
  }
  if (
    production &&
    (!config.publicUrl.startsWith("https://") ||
      origins.some((origin) => !origin.startsWith("https://")))
  )
    throw new Error("Producción requiere HTTPS.");
  if (production && config.storageDriver !== "s3")
    throw new Error(
      "Producción requiere almacenamiento de objetos S3 persistente.",
    );
  if (config.storageDriver === "s3" && !Object.values(config.s3).every(Boolean))
    throw new Error("Falta configuración de almacenamiento S3.");
  if (!["local", "s3"].includes(config.storageDriver))
    throw new Error("STORAGE_DRIVER inválido.");
  return config;
}
