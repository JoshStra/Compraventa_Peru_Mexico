import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { parseEnv } from "node:util";

const file = ".env";
const values = fs.existsSync(file)
  ? parseEnv(fs.readFileSync(file, "utf8"))
  : {};
for (const key of ["POSTGRES_PASSWORD", "APP_DB_PASSWORD", "APP_SECRET"]) {
  if (!values[key] || /replace-with|replace-password/.test(values[key]))
    values[key] = randomBytes(32).toString("hex");
}
if (!/^[a-f0-9]{32,}$/.test(values.APP_DB_PASSWORD))
  throw new Error(
    "APP_DB_PASSWORD debe ser hexadecimal de al menos 32 caracteres para la conexión Docker.",
  );
if (values.APP_SECRET.length < 32)
  throw new Error("APP_SECRET requiere al menos 32 caracteres.");
values.POSTGRES_DB ||= "campustrade";
values.CAMPUS_PORT ||= "3000";
values.POSTGRES_PORT ||= "55432";
for (const value of Object.values(values))
  if (/[\r\n']/.test(value))
    throw new Error(
      "Revisa el formato de .env: no se admiten saltos de línea ni comillas simples en valores Docker.",
    );
fs.writeFileSync(
  file,
  Object.entries(values)
    .map(([key, value]) => `${key}='${value}'`)
    .join("\n") + "\n",
  { mode: 0o600 },
);
console.log(
  "Configuración Docker preparada en .env privado. Los valores existentes se conservaron. Ejecuta docker compose up -d --build.",
);
