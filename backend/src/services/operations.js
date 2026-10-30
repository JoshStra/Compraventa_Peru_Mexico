import { fail } from "../middleware/errors.js";
import { validate, uuid } from "../validators/index.js";
import {
  operationSchema,
  transitionSchema,
  ratingSchema,
} from "../validators/operations.js";

const terminal = {
  sale: "sold",
  rental: "rented",
  exchange: "exchanged",
  donation: "donated",
};
const idsFor = (row) =>
  [
    row.listing_id || row.listingId,
    row.offered_listing_id || row.offeredListingId,
  ]
    .filter(Boolean)
    .sort();
async function lockListings(client, ids) {
  return (
    await client.query(
      "SELECT l.* FROM listings l JOIN users u ON u.id=l.seller_id WHERE l.id=ANY($1::uuid[]) AND l.deleted_at IS NULL AND NOT u.suspended ORDER BY l.id FOR UPDATE OF l",
      [ids],
    )
  ).rows;
}
export function createOperations({ db }) {
  return {
    async create(user, value) {
      const input = validate(operationSchema, value);
      return db.transaction(async (client) => {
        const ids = idsFor(input);
        if (new Set(ids).size !== ids.length)
          fail(
            400,
            "OWN_OFFER",
            "Selecciona otro artículo para el intercambio.",
          );
        const locked = await lockListings(client, ids);
        const item = locked.find((row) => row.id === input.listingId);
        const offered = locked.find((row) => row.id === input.offeredListingId);
        if (!item) fail(404, "LISTING_NOT_FOUND", "La publicación no existe.");
        if (item.seller_id === user.id)
          fail(
            400,
            "OWN_OPERATION",
            "No puedes solicitar tu propia publicación.",
          );
        if (item.status !== "available")
          fail(
            409,
            "LISTING_UNAVAILABLE",
            "El artículo ya no está disponible.",
          );
        let days = 1;
        if (item.modality === "rental") {
          if (!input.rentalStart || !input.rentalEnd)
            fail(400, "RENTAL_DATES", "Indica las fechas de renta.");
          days =
            (Date.parse(input.rentalEnd) - Date.parse(input.rentalStart)) /
              86400000 +
            1;
          if (
            input.rentalStart < new Date().toISOString().slice(0, 10) ||
            days < 1 ||
            days > 90
          )
            fail(
              400,
              "RENTAL_DATES",
              "La renta debe comenzar hoy o después y durar de 1 a 90 días.",
            );
        } else if (input.rentalStart || input.rentalEnd)
          fail(400, "UNEXPECTED_DATES", "Las fechas solo aplican a renta.");
        if (item.modality === "exchange") {
          if (
            !offered ||
            offered.seller_id !== user.id ||
            offered.status !== "available" ||
            offered.modality !== "exchange"
          )
            fail(
              400,
              "INVALID_OFFER",
              "Ofrece una publicación propia disponible para intercambio.",
            );
        } else if (input.offeredListingId)
          fail(
            400,
            "UNEXPECTED_OFFER",
            "La oferta de otro artículo solo aplica a intercambio.",
          );
        const operation = (
          await client.query(
            "INSERT INTO operations(listing_id,requester_id,type,rental_start,rental_end,offered_listing_id,amount_cents) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,status",
            [
              item.id,
              user.id,
              item.modality,
              input.rentalStart || null,
              input.rentalEnd || null,
              input.offeredListingId || null,
              item.price_cents * days,
            ],
          )
        ).rows[0];
        await client.query(
          "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,'operation_requested',$2)",
          [user.id, operation.id],
        );
        return operation;
      });
    },
    async list(user) {
      const rows = (
        await db.query(
          `SELECT o.*,to_char(o.rental_start,'YYYY-MM-DD') AS rental_start_date,to_char(o.rental_end,'YYYY-MM-DD') AS rental_end_date,l.title,l.seller_id,l.status AS listing_status,s.name AS seller_name,r.name AS requester_name,offered.title AS offered_title,
        EXISTS(SELECT 1 FROM ratings rating WHERE rating.operation_id=o.id AND rating.author_id=$1) AS rated
        FROM operations o JOIN listings l ON l.id=o.listing_id JOIN users s ON s.id=l.seller_id JOIN users r ON r.id=o.requester_id
        LEFT JOIN listings offered ON offered.id=o.offered_listing_id WHERE o.requester_id=$1 OR l.seller_id=$1 ORDER BY o.created_at DESC,o.id DESC LIMIT 100`,
          [user.id],
        )
      ).rows;
      return rows.map((row) => ({
        id: row.id,
        listingId: row.listing_id,
        title: row.title,
        sellerId: row.seller_id,
        sellerName: row.seller_name,
        requesterId: row.requester_id,
        requesterName: row.requester_name,
        offeredListingId: row.offered_listing_id,
        offeredTitle: row.offered_title,
        type: row.type,
        status: row.status,
        listingStatus: row.listing_status,
        amount: Number(row.amount_cents) / 100,
        rentalStart: row.rental_start_date,
        rentalEnd: row.rental_end_date,
        rated: row.rated,
        createdAt: row.created_at,
      }));
    },
    async transition(user, id, value) {
      const { status } = validate(transitionSchema, value);
      uuid(id);
      return db.transaction(async (client) => {
        const original = (
          await client.query("SELECT * FROM operations WHERE id=$1", [id])
        ).rows[0];
        if (!original)
          fail(404, "OPERATION_NOT_FOUND", "La operación no existe.");
        const ids = idsFor(original);
        const locked = await lockListings(client, ids);
        const operation = (
          await client.query(
            "SELECT * FROM operations WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        const item = locked.find((row) => row.id === operation.listing_id);
        if (!item || locked.length !== ids.length)
          fail(
            409,
            "LISTING_UNAVAILABLE",
            "Algún artículo de la operación ya no está disponible.",
          );
        const owner = item.seller_id === user.id;
        const requester = operation.requester_id === user.id;
        if (
          !owner &&
          !requester &&
          !(user.role === "admin" && status === "cancelled")
        )
          fail(
            403,
            "OPERATION_FORBIDDEN",
            "No puedes modificar esta operación.",
          );
        const allowed =
          operation.status === "pending"
            ? ["accepted", "rejected", "cancelled"]
            : operation.status === "accepted"
              ? ["completed", "cancelled"]
              : [];
        if (!allowed.includes(status))
          fail(
            409,
            "INVALID_TRANSITION",
            "La operación ya cambió o su estado es terminal.",
          );
        if (["accepted", "rejected", "completed"].includes(status) && !owner)
          fail(
            403,
            "OWNER_REQUIRED",
            "Solo el propietario puede realizar esta transición.",
          );
        if (status === "accepted") {
          if (locked.some((row) => row.status !== "available"))
            fail(
              409,
              "LISTING_UNAVAILABLE",
              "Un artículo ya está reservado o finalizado.",
            );
          await client.query(
            "UPDATE listings SET status='reserved',updated_at=now() WHERE id=ANY($1::uuid[])",
            [ids],
          );
          await client.query(
            "UPDATE operations SET status='rejected',updated_at=now() WHERE status='pending' AND id<>$1 AND (listing_id=ANY($2::uuid[]) OR offered_listing_id=ANY($2::uuid[]))",
            [id, ids],
          );
        }
        if (status === "completed") {
          if (locked.some((row) => row.status !== "reserved"))
            fail(
              409,
              "INVALID_LISTING_STATE",
              "Los artículos no tienen una reserva activa.",
            );
          await client.query(
            "UPDATE listings SET status=$2,updated_at=now() WHERE id=ANY($1::uuid[])",
            [ids, terminal[operation.type]],
          );
        }
        if (status === "cancelled" && operation.status === "accepted")
          await client.query(
            "UPDATE listings SET status='available',updated_at=now() WHERE id=ANY($1::uuid[]) AND status='reserved'",
            [ids],
          );
        await client.query(
          "UPDATE operations SET status=$2,updated_at=now() WHERE id=$1",
          [id, status],
        );
        await client.query(
          "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,$2,$3)",
          [user.id, `operation_${status}`, id],
        );
        return { id, status };
      });
    },
    async returnRental(user, id) {
      uuid(id);
      return db.transaction(async (client) => {
        const original = (
          await client.query("SELECT * FROM operations WHERE id=$1", [id])
        ).rows[0];
        if (!original)
          fail(404, "OPERATION_NOT_FOUND", "La operación no existe.");
        const [item] = await lockListings(client, [original.listing_id]);
        const operation = (
          await client.query(
            "SELECT * FROM operations WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!item || item.seller_id !== user.id)
          fail(
            403,
            "OWNER_REQUIRED",
            "Solo el propietario registra la devolución.",
          );
        if (
          operation.type !== "rental" ||
          operation.status !== "completed" ||
          item.status !== "rented"
        )
          fail(409, "INVALID_RETURN", "No existe una renta por devolver.");
        await client.query(
          "UPDATE listings SET status='available',updated_at=now() WHERE id=$1",
          [item.id],
        );
        await client.query(
          "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,'rental_returned',$2)",
          [user.id, id],
        );
        return {
          message: "Devolución registrada. El artículo está disponible.",
        };
      });
    },
    async rate(user, id, value) {
      const input = validate(ratingSchema, value);
      uuid(id);
      return db.transaction(async (client) => {
        const operation = (
          await client.query(
            "SELECT o.*,l.seller_id FROM operations o JOIN listings l ON l.id=o.listing_id WHERE o.id=$1 FOR UPDATE OF o",
            [id],
          )
        ).rows[0];
        if (!operation)
          fail(404, "OPERATION_NOT_FOUND", "La operación no existe.");
        if (![operation.requester_id, operation.seller_id].includes(user.id))
          fail(
            403,
            "RATING_FORBIDDEN",
            "Solo los participantes pueden calificar.",
          );
        if (operation.status !== "completed")
          fail(409, "RATING_TOO_EARLY", "Primero debe finalizar la operación.");
        const target =
          user.id === operation.seller_id
            ? operation.requester_id
            : operation.seller_id;
        return (
          await client.query(
            "INSERT INTO ratings(operation_id,author_id,target_id,score,comment) VALUES($1,$2,$3,$4,$5) RETURNING id,score,comment",
            [id, user.id, target, input.score, input.comment],
          )
        ).rows[0];
      });
    },
    async publicProfile(id) {
      uuid(id);
      const user = (
        await db.query(
          "SELECT u.id,u.name,u.career,u.semester,u.verified_at,u.created_at,COALESCE((SELECT avg(score)::float FROM ratings WHERE target_id=u.id),0) AS rating,(SELECT count(*)::int FROM ratings WHERE target_id=u.id) AS rating_count FROM users u WHERE u.id=$1 AND NOT u.suspended",
          [id],
        )
      ).rows[0];
      if (!user) fail(404, "USER_NOT_FOUND", "El perfil no está disponible.");
      const ratings = (
        await db.query(
          'SELECT r.id,r.score,r.comment,r.created_at AS "createdAt",u.name AS author FROM ratings r JOIN users u ON u.id=r.author_id WHERE r.target_id=$1 ORDER BY r.created_at DESC LIMIT 50',
          [id],
        )
      ).rows;
      return {
        id: user.id,
        name: user.name,
        career: user.career,
        semester: user.semester,
        verified: Boolean(user.verified_at),
        createdAt: user.created_at,
        rating: user.rating,
        ratingCount: user.rating_count,
        ratings,
      };
    },
  };
}
