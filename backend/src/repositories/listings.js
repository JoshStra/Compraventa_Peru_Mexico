const selectListing = `SELECT l.*,c.name AS category_name,u.name AS seller_name,u.career AS seller_career,u.verified_at,
  COALESCE((SELECT avg(r.score)::float FROM ratings r WHERE r.target_id=u.id),0) AS rating,
  (SELECT count(*)::int FROM ratings r WHERE r.target_id=u.id) AS rating_count,
  COALESCE((SELECT json_agg(json_build_object('id',i.id,'url','/api/v1/images/'||i.id) ORDER BY i.created_at,i.id) FROM listing_images i WHERE i.listing_id=l.id),'[]'::json) AS images
  FROM listings l JOIN categories c ON c.id=l.category_id JOIN users u ON u.id=l.seller_id`;
const publicWhere =
  "l.deleted_at IS NULL AND NOT u.suspended AND l.status<>'draft'";
export const listingDto = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  location: row.location,
  categoryId: row.category_id,
  category: row.category_name,
  career: row.career,
  modality: row.modality,
  condition: row.condition,
  price: row.price_cents / 100,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  images: row.images,
  seller: {
    id: row.seller_id,
    name: row.seller_name,
    career: row.seller_career,
    verified: Boolean(row.verified_at),
    rating: row.rating,
    ratingCount: row.rating_count,
  },
});

export function listingRepository(db) {
  return {
    async get(id, connection = db) {
      const row = (
        await connection.query(
          `${selectListing} WHERE ${publicWhere} AND l.id=$1`,
          [id],
        )
      ).rows[0];
      return row ? listingDto(row) : null;
    },
    async list(filters, scope = {}) {
      const values = [];
      const where = [publicWhere];
      const bind = (value) => {
        values.push(value);
        return `$${values.length}`;
      };
      if (scope.ownerId) where.push(`l.seller_id=${bind(scope.ownerId)}`);
      if (scope.favoriteUserId)
        where.push(
          `EXISTS(SELECT 1 FROM favorites f WHERE f.listing_id=l.id AND f.user_id=${bind(scope.favoriteUserId)})`,
        );
      if (filters.status !== "all")
        where.push(`l.status=${bind(filters.status)}`);
      for (const [key, column] of Object.entries({
        career: "l.career",
        categoryId: "l.category_id",
        modality: "l.modality",
        condition: "l.condition",
      }))
        if (filters[key]) where.push(`${column}=${bind(filters[key])}`);
      if (filters.q) {
        const normalized = filters.q
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[\\%_]/g, "\\$&");
        where.push(
          `translate(lower(l.title||' '||l.description||' '||c.name),'áéíóúüñ','aeiouun') LIKE ${bind(`%${normalized}%`)}`,
        );
      }
      if (filters.minPrice != null)
        where.push(
          `l.price_cents>=${bind(Math.round(filters.minPrice * 100))}`,
        );
      if (filters.maxPrice != null)
        where.push(
          `l.price_cents<=${bind(Math.round(filters.maxPrice * 100))}`,
        );
      const predicate = where.join(" AND ");
      const total = (
        await db.query(
          `SELECT count(*)::int AS count FROM listings l JOIN categories c ON c.id=l.category_id JOIN users u ON u.id=l.seller_id WHERE ${predicate}`,
          values,
        )
      ).rows[0].count;
      const rows = (
        await db.query(
          `${selectListing} WHERE ${predicate} ORDER BY l.created_at DESC,l.id DESC LIMIT ${bind(filters.limit)} OFFSET ${bind((filters.page - 1) * filters.limit)}`,
          values,
        )
      ).rows;
      return {
        items: rows.map(listingDto),
        page: filters.page,
        limit: filters.limit,
        total,
      };
    },
  };
}
