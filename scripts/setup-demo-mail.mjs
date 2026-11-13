import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";

const file = ".env";
if (!fs.existsSync(file))
  throw new Error("Ejecuta npm run docker:setup antes de configurar el buzón.");
const source = fs.readFileSync(file, "utf8");
const current = parseEnv(source);
if (
  current.RESEND_API_KEY ||
  (current.SMTP_HOST && current.SMTP_HOST !== "mailpit") ||
  current.SMTP_USER ||
  current.SMTP_PASSWORD
)
  throw new Error(
    "Ya hay un proveedor de correo configurado; no se sustituye automáticamente.",
  );
const port = Number(current.MAILBOX_PORT || 8025);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("MAILBOX_PORT inválido.");
const profiles = new Set(
  (current.COMPOSE_PROFILES || "").split(",").filter(Boolean),
);
profiles.add("correo-demo");
const updates = {
  COMPOSE_PROFILES: [...profiles].join(","),
  MAIL_DELIVERY_MODE: "local_demo",
  LOCAL_MAILBOX_URL: `http://127.0.0.1:${port}`,
  MAILBOX_PORT: String(port),
  MAIL_FROM: "CampusTrade Demo <campustrade@demo.local>",
  SMTP_HOST: "mailpit",
  SMTP_PORT: "1025",
  SMTP_SECURE: "false",
};
const backup = path.join(
  "backend",
  ".data",
  "mail-demo",
  `env-before-${new Date().toISOString().replaceAll(":", "-")}.env`,
);
fs.mkdirSync(path.dirname(backup), { recursive: true });
fs.copyFileSync(file, backup);
let next = source;
for (const [key, value] of Object.entries(updates)) {
  next = next.replace(
    new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=.*(?:\\r?\\n|$)`, "gm"),
    "",
  );
  next = next.trimEnd() + `\n${key}='${value}'\n`;
}
fs.writeFileSync(file, next, { mode: 0o600 });
console.log(
  "Buzón de demostración preparado en .env privado; se conservó una copia privada anterior. No se envían correos a ITESA. Ejecuta docker compose up -d --build --wait.",
);
