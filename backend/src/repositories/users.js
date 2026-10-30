export const privateUser = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        career: row.career,
        semester: row.semester,
        role: row.role,
        verified: Boolean(row.verified_at),
        suspended: row.suspended,
        createdAt: row.created_at,
      }
    : null;
export function userRepository(db) {
  return {
    async byEmail(email) {
      return (await db.query("SELECT * FROM users WHERE email=$1", [email]))
        .rows[0];
    },
    async activeCareer(career) {
      return Boolean(
        (
          await db.query("SELECT name FROM careers WHERE name=$1 AND active", [
            career,
          ])
        ).rows.length,
      );
    },
    async create(input) {
      return (
        await db.query(
          "INSERT INTO users(email,student_hash,name,password_hash,career,semester) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
          [
            input.email,
            input.studentHash,
            input.name,
            input.passwordHash,
            input.career,
            input.semester,
          ],
        )
      ).rows[0];
    },
    async profile(id, input) {
      return (
        await db.query(
          "UPDATE users SET name=$2,career=$3,semester=$4 WHERE id=$1 RETURNING *",
          [id, input.name, input.career, input.semester],
        )
      ).rows[0];
    },
  };
}
