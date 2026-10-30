import { z, trimmed } from "./index.js";

export const modalities = ["sale", "rental", "exchange", "donation"];
export const conditions = ["new", "like_new", "good", "fair"];
export const listingSchema = z
  .object({
    title: trimmed(8, 100),
    description: trimmed(20, 1500),
    location: trimmed(3, 120),
    categoryId: z.uuid(),
    career: trimmed(1, 80),
    modality: z.enum(modalities),
    condition: z.enum(conditions),
    price: z.number().finite().min(0).max(1000000),
    imageIds: z.array(z.uuid()).max(4).default([]),
  })
  .strict()
  .superRefine((input, context) => {
    const priced = ["sale", "rental"].includes(input.modality);
    if (
      (priced && input.price <= 0) ||
      (!priced && input.price !== 0) ||
      Math.abs(input.price * 100 - Math.round(input.price * 100)) > 0.00001
    )
      context.addIssue({
        code: "custom",
        path: ["price"],
        message: "Precio no válido para la modalidad; usa hasta dos decimales.",
      });
    if (new Set(input.imageIds).size !== input.imageIds.length)
      context.addIssue({
        code: "custom",
        path: ["imageIds"],
        message: "No repitas imágenes.",
      });
  });
export const listingQuerySchema = z
  .object({
    q: z.string().trim().max(100).optional(),
    career: z.string().max(80).optional(),
    categoryId: z.uuid().optional(),
    modality: z.enum(modalities).optional(),
    condition: z.enum(conditions).optional(),
    status: z
      .enum([
        "all",
        "available",
        "reserved",
        "sold",
        "rented",
        "exchanged",
        "donated",
      ])
      .default("available"),
    minPrice: z.coerce.number().finite().min(0).max(1000000).optional(),
    maxPrice: z.coerce.number().finite().min(0).max(1000000).optional(),
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  })
  .strict()
  .refine(
    (input) =>
      input.minPrice == null ||
      input.maxPrice == null ||
      input.minPrice <= input.maxPrice,
    { path: ["minPrice"], message: "El precio mínimo supera al máximo." },
  );
