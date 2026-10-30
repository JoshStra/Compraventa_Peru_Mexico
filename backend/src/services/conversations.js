import { fail } from "../middleware/errors.js";
import { validate, z, trimmed, uuid } from "../validators/index.js";

export function createConversations({ db }) {
  async function participant(user, id) {
    const conversation = (
      await db.query("SELECT * FROM conversations WHERE id=$1", [uuid(id)])
    ).rows[0];
    if (!conversation)
      fail(404, "CONVERSATION_NOT_FOUND", "La conversación no existe.");
    if (![conversation.buyer_id, conversation.seller_id].includes(user.id))
      fail(403, "CONVERSATION_FORBIDDEN", "Esta conversación es privada.");
    return conversation;
  }
  const messageDto = (row) => ({
    id: row.id,
    body: row.body,
    senderId: row.sender_id,
    sentAt: row.sent_at,
  });
  return {
    async open(user, value) {
      const { listingId } = validate(
        z.object({ listingId: z.uuid() }).strict(),
        value,
      );
      return db.transaction(async (client) => {
        const item = (
          await client.query(
            "SELECT l.* FROM listings l JOIN users u ON u.id=l.seller_id WHERE l.id=$1 AND l.deleted_at IS NULL AND NOT u.suspended FOR UPDATE OF l",
            [listingId],
          )
        ).rows[0];
        if (!item) fail(404, "LISTING_NOT_FOUND", "La publicación no existe.");
        if (item.seller_id === user.id)
          fail(
            400,
            "OWN_CONVERSATION",
            "No puedes abrir una conversación contigo mismo.",
          );
        if (item.status !== "available")
          fail(
            409,
            "LISTING_UNAVAILABLE",
            "El artículo ya no está disponible.",
          );
        return (
          await client.query(
            "INSERT INTO conversations(listing_id,buyer_id,seller_id) VALUES($1,$2,$3) ON CONFLICT(listing_id,buyer_id) DO UPDATE SET listing_id=excluded.listing_id RETURNING id",
            [listingId, user.id, item.seller_id],
          )
        ).rows[0];
      });
    },
    async list(user) {
      return (
        await db.query(
          `SELECT c.id,c.listing_id AS "listingId",l.title,
        CASE WHEN c.buyer_id=$1 THEN s.name ELSE b.name END AS name,
        (SELECT m.body FROM messages m WHERE m.conversation_id=c.id ORDER BY m.sent_at DESC,m.id DESC LIMIT 1) AS "lastMessage",
        COALESCE((SELECT max(m.sent_at) FROM messages m WHERE m.conversation_id=c.id),c.created_at) AS "updatedAt"
        FROM conversations c JOIN listings l ON l.id=c.listing_id JOIN users s ON s.id=c.seller_id JOIN users b ON b.id=c.buyer_id
        WHERE c.buyer_id=$1 OR c.seller_id=$1 ORDER BY "updatedAt" DESC,c.id DESC LIMIT 100`,
          [user.id],
        )
      ).rows;
    },
    async messages(user, id, query) {
      await participant(user, id);
      const { page, limit } = validate(
        z
          .object({
            page: z.coerce.number().int().min(1).max(10000).default(1),
            limit: z.coerce.number().int().min(1).max(100).default(50),
          })
          .strict(),
        query,
      );
      const rows = (
        await db.query(
          "SELECT * FROM messages WHERE conversation_id=$1 ORDER BY sent_at DESC,id DESC LIMIT $2 OFFSET $3",
          [id, limit, (page - 1) * limit],
        )
      ).rows;
      const total = (
        await db.query(
          "SELECT count(*)::int AS count FROM messages WHERE conversation_id=$1",
          [id],
        )
      ).rows[0].count;
      return { items: rows.reverse().map(messageDto), page, limit, total };
    },
    async send(user, id, value) {
      const { body } = validate(
        z.object({ body: trimmed(1, 2000) }).strict(),
        value,
      );
      const conversation = await participant(user, id);
      const other =
        conversation.buyer_id === user.id
          ? conversation.seller_id
          : conversation.buyer_id;
      if (
        (await db.query("SELECT suspended FROM users WHERE id=$1", [other]))
          .rows[0]?.suspended
      )
        fail(
          409,
          "PARTICIPANT_UNAVAILABLE",
          "La otra cuenta no está disponible.",
        );
      return messageDto(
        (
          await db.query(
            "INSERT INTO messages(conversation_id,sender_id,body) VALUES($1,$2,$3) RETURNING *",
            [id, user.id, body],
          )
        ).rows[0],
      );
    },
  };
}
