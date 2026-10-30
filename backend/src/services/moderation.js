import { fail } from "../middleware/errors.js";
import { validate, z, trimmed, uuid } from "../validators/index.js";
import { listingRepository } from "../repositories/listings.js";

const reportSchema = z
  .object({
    listingId: z.uuid(),
    reason: z.enum(["spam", "inappropriate", "fraud", "prohibited"]),
    detail: trimmed(10, 1000),
  })
  .strict();
export function createModeration({ db }) {
  const repository = listingRepository(db);
  const assertAdmin = (user) => {
    if (user.role !== "admin")
      fail(403, "ADMIN_REQUIRED", "Se requiere un administrador.");
  };
  return {
    async report(user, value) {
      const input = validate(reportSchema, value);
      if (!(await repository.get(input.listingId)))
        fail(404, "LISTING_NOT_FOUND", "La publicación no existe.");
      return (
        await db.query(
          'INSERT INTO reports(reporter_id,listing_id,reason,detail) VALUES($1,$2,$3,$4) RETURNING id,status,created_at AS "createdAt"',
          [user.id, input.listingId, input.reason, input.detail],
        )
      ).rows[0];
    },
    async ownReports(user) {
      return (
        await db.query(
          'SELECT r.id,r.listing_id AS "listingId",l.title,r.reason,r.detail,r.status,r.resolution,r.created_at AS "createdAt" FROM reports r JOIN listings l ON l.id=r.listing_id WHERE r.reporter_id=$1 ORDER BY r.created_at DESC LIMIT 100',
          [user.id],
        )
      ).rows;
    },
    async overview(user) {
      assertAdmin(user);
      const [reports, users, listings, categories, careers, operations] =
        await Promise.all([
          db.query(
            'SELECT r.id,r.listing_id AS "listingId",l.title,r.reason,r.detail,r.status,r.resolution,u.name AS reporter,r.created_at AS "createdAt" FROM reports r JOIN listings l ON l.id=r.listing_id JOIN users u ON u.id=r.reporter_id ORDER BY r.created_at DESC LIMIT 100',
          ),
          db.query(
            "SELECT id,name,email,career,role,suspended,verified_at IS NOT NULL AS verified FROM users ORDER BY created_at DESC LIMIT 100",
          ),
          db.query(
            'SELECT l.id,l.title,l.status,l.deleted_at AS "deletedAt",u.name AS seller FROM listings l JOIN users u ON u.id=l.seller_id ORDER BY l.created_at DESC LIMIT 100',
          ),
          db.query("SELECT id,name,active FROM categories ORDER BY name"),
          db.query("SELECT name,active FROM careers ORDER BY name"),
          db.query(
            "SELECT o.id,l.title,o.type,o.status FROM operations o JOIN listings l ON l.id=o.listing_id WHERE o.status='accepted' ORDER BY o.updated_at DESC LIMIT 100",
          ),
        ]);
      return {
        reports: reports.rows,
        users: users.rows,
        listings: listings.rows,
        categories: categories.rows,
        careers: careers.rows,
        operations: operations.rows,
      };
    },
    async resolve(user, id, value) {
      assertAdmin(user);
      uuid(id);
      const input = validate(
        z
          .object({
            status: z.enum(["reviewing", "resolved", "dismissed"]),
            resolution: trimmed(10, 1500),
          })
          .strict(),
        value,
      );
      return db.transaction(async (client) => {
        const report = (
          await client.query(
            "SELECT status FROM reports WHERE id=$1 FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!report) fail(404, "REPORT_NOT_FOUND", "El reporte no existe.");
        if (!["open", "reviewing"].includes(report.status))
          fail(409, "REPORT_CLOSED", "Este reporte ya está cerrado.");
        await client.query(
          "UPDATE reports SET status=$2,resolution=$3,resolved_by=$4,updated_at=now() WHERE id=$1",
          [id, input.status, input.resolution, user.id],
        );
        await client.query(
          "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,$2,$3)",
          [user.id, `report_${input.status}`, id],
        );
        return { id, ...input };
      });
    },
    async suspend(user, id, value) {
      assertAdmin(user);
      uuid(id);
      const { suspended } = validate(
        z.object({ suspended: z.boolean() }).strict(),
        value,
      );
      if (id === user.id)
        fail(400, "SELF_MODERATION", "No puedes suspender tu propia cuenta.");
      return db.transaction(async (client) => {
        const target = (
          await client.query("SELECT role FROM users WHERE id=$1 FOR UPDATE", [
            id,
          ])
        ).rows[0];
        if (!target) fail(404, "USER_NOT_FOUND", "La cuenta no existe.");
        if (target.role === "admin")
          fail(
            400,
            "ADMIN_PROTECTED",
            "La suspensión de administradores requiere intervención del responsable del sistema.",
          );
        if (suspended) {
          await client.query(
            "UPDATE operations o SET status='cancelled',updated_at=now() FROM listings l WHERE l.id=o.listing_id AND o.status='pending' AND (o.requester_id=$1 OR l.seller_id=$1)",
            [id],
          );
          const accepted = (
            await client.query(
              "SELECT o.id FROM operations o JOIN listings l ON l.id=o.listing_id WHERE o.status='accepted' AND (o.requester_id=$1 OR l.seller_id=$1) LIMIT 1",
              [id],
            )
          ).rows[0];
          if (accepted)
            fail(
              409,
              "ACTIVE_OPERATIONS",
              "Cancela las reservas activas antes de suspender la cuenta.",
            );
          await client.query("DELETE FROM sessions WHERE user_id=$1", [id]);
        }
        await client.query("UPDATE users SET suspended=$2 WHERE id=$1", [
          id,
          suspended,
        ]);
        await client.query(
          "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,$2,$3)",
          [user.id, suspended ? "user_suspended" : "user_reactivated", id],
        );
        return { id, suspended };
      });
    },
    async hideListing(user, id) {
      assertAdmin(user);
      uuid(id);
      return db.transaction(async (client) => {
        const item = (
          await client.query(
            "SELECT status FROM listings WHERE id=$1 AND deleted_at IS NULL FOR UPDATE",
            [id],
          )
        ).rows[0];
        if (!item) fail(404, "LISTING_NOT_FOUND", "La publicación no existe.");
        if (["reserved", "rented"].includes(item.status))
          fail(
            409,
            "ACTIVE_OPERATIONS",
            "Cancela la reserva o registra la devolución antes de retirar el artículo.",
          );
        await client.query(
          "UPDATE listings SET deleted_at=now(),status=CASE WHEN status='available' THEN 'cancelled' ELSE status END,updated_at=now() WHERE id=$1",
          [id],
        );
        await client.query(
          "UPDATE operations SET status='cancelled',updated_at=now() WHERE status='pending' AND (listing_id=$1 OR offered_listing_id=$1)",
          [id],
        );
        await client.query(
          "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,'listing_moderated',$2)",
          [user.id, id],
        );
        return { id, message: "Publicación retirada por moderación." };
      });
    },
    async addCategory(user, value) {
      assertAdmin(user);
      const { name } = validate(
        z.object({ name: trimmed(2, 80) }).strict(),
        value,
      );
      return (
        await db.query(
          "INSERT INTO categories(name) VALUES($1) RETURNING id,name,active",
          [name],
        )
      ).rows[0];
    },
    async setCategory(user, id, value) {
      assertAdmin(user);
      uuid(id);
      const { active } = validate(
        z.object({ active: z.boolean() }).strict(),
        value,
      );
      const row = (
        await db.query(
          "UPDATE categories SET active=$2 WHERE id=$1 RETURNING id,name,active",
          [id, active],
        )
      ).rows[0];
      if (!row) fail(404, "CATEGORY_NOT_FOUND", "La categoría no existe.");
      return row;
    },
    async addCareer(user, value) {
      assertAdmin(user);
      const { name } = validate(
        z.object({ name: trimmed(2, 80) }).strict(),
        value,
      );
      return (
        await db.query(
          "INSERT INTO careers(name) VALUES($1) RETURNING name,active",
          [name],
        )
      ).rows[0];
    },
    async setCareer(user, value) {
      assertAdmin(user);
      const { name, active } = validate(
        z.object({ name: trimmed(2, 80), active: z.boolean() }).strict(),
        value,
      );
      const row = (
        await db.query(
          "UPDATE careers SET active=$2 WHERE name=$1 RETURNING name,active",
          [name, active],
        )
      ).rows[0];
      if (!row) fail(404, "CAREER_NOT_FOUND", "La carrera no existe.");
      return row;
    },
  };
}
