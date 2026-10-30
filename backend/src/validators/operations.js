import { z, trimmed } from "./index.js";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return (
      Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "Fecha no válida.");
export const operationSchema = z
  .object({
    listingId: z.uuid(),
    rentalStart: date.optional(),
    rentalEnd: date.optional(),
    offeredListingId: z.uuid().optional(),
  })
  .strict();
export const transitionSchema = z
  .object({
    status: z.enum(["accepted", "rejected", "cancelled", "completed"]),
  })
  .strict();
export const ratingSchema = z
  .object({ score: z.number().int().min(1).max(5), comment: trimmed(5, 1000) })
  .strict();
