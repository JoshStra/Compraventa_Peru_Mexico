import { z } from "zod";
import { fail } from "../middleware/errors.js";

export { z };
export function validate(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  fail(
    400,
    "VALIDATION_ERROR",
    "Revisa los campos indicados.",
    Object.fromEntries(
      result.error.issues.map((issue) => [
        issue.path.join(".") || "form",
        issue.message,
      ]),
    ),
  );
}
export const uuid = (value) => validate(z.uuid(), value);
export const trimmed = (min, max) => z.string().trim().min(min).max(max);
export const email = z.string().trim().toLowerCase().max(254).pipe(z.email());
export const password = z
  .string()
  .min(12, "Usa al menos 12 caracteres.")
  .max(128);
export const profileSchema = z
  .object({
    name: trimmed(2, 80),
    career: trimmed(1, 80),
    semester: z.coerce.number().int().min(1).max(16),
  })
  .strict();
export const registerSchema = profileSchema
  .extend({
    email,
    password,
    studentId: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9-]{4,30}$/, "Matrícula no válida."),
  })
  .strict();
export const loginSchema = z
  .object({ email, password: z.string().min(1).max(128) })
  .strict();
export const tokenSchema = z
  .object({ token: z.string().regex(/^[a-f0-9]{64}$/) })
  .strict();
