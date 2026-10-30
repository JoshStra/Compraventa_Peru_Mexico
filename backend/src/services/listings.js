import { randomUUID } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { fail } from "../middleware/errors.js";
import { validate, uuid } from "../validators/index.js";
import { listingSchema, listingQuerySchema } from "../validators/listings.js";
import { listingRepository } from "../repositories/listings.js";

export function createListings({ db, storage }) {
  const repository = listingRepository(db);
  async function catalogExists(client, input) {
    if (
      !(
        await client.query("SELECT id FROM categories WHERE id=$1 AND active", [
          input.categoryId,
        ])
      ).rows.length ||
      !(
        await client.query(
          "SELECT name FROM careers WHERE name=$1 AND active",
          [input.career],
        )
      ).rows.length
    )
      fail(400, "INVALID_CATALOG", "Selecciona categoría y carrera activas.");
  }
  async function attach(client, listingId, userId, imageIds) {
    const images = (
      await client.query(
        "SELECT id,owner_id,listing_id FROM listing_images WHERE id=ANY($1::uuid[]) FOR UPDATE",
        [imageIds],
      )
    ).rows;
    if (images.length !== imageIds.length)
      fail(400, "IMAGE_NOT_FOUND", "Alguna imagen no existe.");
    if (
      images.some(
        (image) =>
          image.owner_id !== userId ||
          (image.listing_id && image.listing_id !== listingId),
      )
    )
      fail(
        403,
        "IMAGE_FORBIDDEN",
        "No puedes usar imágenes ajenas o de otra publicación.",
      );
    await client.query(
      "UPDATE listing_images SET listing_id=NULL WHERE listing_id=$1 AND NOT(id=ANY($2::uuid[]))",
      [listingId, imageIds],
    );
    await client.query(
      "UPDATE listing_images SET listing_id=$1 WHERE id=ANY($2::uuid[])",
      [listingId, imageIds],
    );
  }
  async function ownLock(client, id, userId) {
    const item = (
      await client.query(
        "SELECT * FROM listings WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
        [uuid(id)],
      )
    ).rows[0];
    if (!item) fail(404, "LISTING_NOT_FOUND", "La publicación no existe.");
    if (item.seller_id !== userId)
      fail(
        403,
        "LISTING_FORBIDDEN",
        "Solo el propietario puede modificar esta publicación.",
      );
    return item;
  }
  return {
    list: (query, scope) =>
      repository.list(validate(listingQuerySchema, query), scope),
    async get(id) {
      const item = await repository.get(uuid(id));
      if (!item) fail(404, "LISTING_NOT_FOUND", "La publicación no existe.");
      return item;
    },
    async create(user, value) {
      const input = validate(listingSchema, value);
      const id = await db.transaction(async (client) => {
        await catalogExists(client, input);
        const item = (
          await client.query(
            "INSERT INTO listings(seller_id,category_id,career,title,description,location,modality,condition,price_cents) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
            [
              user.id,
              input.categoryId,
              input.career,
              input.title,
              input.description,
              input.location,
              input.modality,
              input.condition,
              Math.round(input.price * 100),
            ],
          )
        ).rows[0];
        await attach(client, item.id, user.id, input.imageIds);
        return item.id;
      });
      return repository.get(id);
    },
    async update(user, id, value) {
      const input = validate(listingSchema, value);
      await db.transaction(async (client) => {
        const item = await ownLock(client, id, user.id);
        if (item.status !== "available")
          fail(
            409,
            "LISTING_UNAVAILABLE",
            "Solo puedes editar publicaciones disponibles.",
          );
        await catalogExists(client, input);
        await client.query(
          "UPDATE listings SET category_id=$2,career=$3,title=$4,description=$5,location=$6,modality=$7,condition=$8,price_cents=$9,updated_at=now() WHERE id=$1",
          [
            id,
            input.categoryId,
            input.career,
            input.title,
            input.description,
            input.location,
            input.modality,
            input.condition,
            Math.round(input.price * 100),
          ],
        );
        await attach(client, id, user.id, input.imageIds);
      });
      return repository.get(id);
    },
    async remove(user, id) {
      await db.transaction(async (client) => {
        const item = await ownLock(client, id, user.id);
        if (["reserved", "rented"].includes(item.status))
          fail(
            409,
            "LISTING_BUSY",
            "Finaliza o cancela la operación activa antes de retirar el artículo.",
          );
        await client.query(
          "UPDATE listings SET deleted_at=now(),status=CASE WHEN status='available' THEN 'cancelled' ELSE status END,updated_at=now() WHERE id=$1",
          [id],
        );
        await client.query(
          "UPDATE operations SET status='cancelled',updated_at=now() WHERE listing_id=$1 AND status='pending'",
          [id],
        );
      });
      return { message: "Publicación retirada. Se conserva su historial." };
    },
    async favorite(user, id, enabled) {
      await this.get(id);
      if (enabled)
        await db.query(
          "INSERT INTO favorites(user_id,listing_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
          [user.id, id],
        );
      else
        await db.query(
          "DELETE FROM favorites WHERE user_id=$1 AND listing_id=$2",
          [user.id, id],
        );
      return { favorite: enabled };
    },
    async favoriteIds(user) {
      return (
        await db.query(
          "SELECT f.listing_id FROM favorites f JOIN listings l ON l.id=f.listing_id WHERE f.user_id=$1 AND l.deleted_at IS NULL",
          [user.id],
        )
      ).rows.map((row) => row.listing_id);
    },
    async upload(user, file) {
      if (!file) fail(400, "IMAGE_REQUIRED", "Selecciona una imagen.");
      if (file.size > 5 * 1024 * 1024)
        fail(413, "IMAGE_TOO_LARGE", "La imagen supera 5 MB.");
      const extensions = {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      };
      if (
        !extensions[file.mimetype]?.includes(
          path.extname(file.originalname).toLowerCase(),
        )
      )
        fail(
          400,
          "IMAGE_TYPE",
          "Usa JPG, PNG o WebP con extensión y contenido compatibles.",
        );
      let buffer;
      try {
        const image = sharp(file.buffer, {
          limitInputPixels: 20000000,
          failOn: "error",
        });
        const info = await image.metadata();
        if (file.mimetype !== `image/${info.format}` || info.pages > 1)
          throw new Error("Unsupported image");
        buffer = await image
          .rotate()
          .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
      } catch {
        fail(
          400,
          "IMAGE_CONTENT",
          "El archivo no contiene una imagen válida o supera el límite de píxeles.",
        );
      }
      const pending = (
        await db.query(
          "SELECT count(*)::int AS count FROM listing_images WHERE owner_id=$1 AND listing_id IS NULL",
          [user.id],
        )
      ).rows[0].count;
      if (pending >= 20)
        fail(
          409,
          "IMAGE_QUOTA",
          "Tienes demasiadas imágenes sin publicar. Elimina las que no uses.",
        );
      const id = randomUUID();
      const key = `${randomUUID()}.webp`;
      await storage.put(key, buffer);
      try {
        await db.query(
          "INSERT INTO listing_images(id,owner_id,object_key,mime_type,size) VALUES($1,$2,$3,'image/webp',$4)",
          [id, user.id, key, buffer.length],
        );
      } catch (error) {
        await storage.remove(key);
        throw error;
      }
      return { id, url: `/api/v1/images/${id}` };
    },
    async image(user, id) {
      const image = (
        await db.query(
          "SELECT i.object_key,i.owner_id,l.deleted_at,l.status,u.suspended FROM listing_images i LEFT JOIN listings l ON l.id=i.listing_id LEFT JOIN users u ON u.id=l.seller_id WHERE i.id=$1",
          [uuid(id)],
        )
      ).rows[0];
      if (
        !image ||
        ((!image.status ||
          image.deleted_at ||
          image.status === "draft" ||
          image.suspended) &&
          image.owner_id !== user?.id)
      )
        fail(404, "IMAGE_NOT_FOUND", "La imagen no está disponible.");
      return {
        location: await storage.location(image.object_key),
        public: Boolean(
          image.status &&
          image.status !== "draft" &&
          !image.deleted_at &&
          !image.suspended,
        ),
      };
    },
    async removeUpload(user, id) {
      const image = (
        await db.query(
          "SELECT object_key,owner_id,listing_id FROM listing_images WHERE id=$1",
          [uuid(id)],
        )
      ).rows[0];
      if (!image) fail(404, "IMAGE_NOT_FOUND", "La imagen no existe.");
      if (image.owner_id !== user.id || image.listing_id)
        fail(
          403,
          "IMAGE_FORBIDDEN",
          "Solo puedes eliminar tus imágenes sin publicar.",
        );
      await storage.remove(image.object_key);
      await db.query("DELETE FROM listing_images WHERE id=$1", [id]);
      return { message: "Imagen eliminada." };
    },
  };
}
