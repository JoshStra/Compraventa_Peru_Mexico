import { loadConfig } from "../config.js";
import { createDatabase } from "../repositories/database.js";
import { email, validate } from "../validators/index.js";

const account = validate(email, process.argv[2]);
const db = createDatabase(loadConfig().databaseUrl);
try {
  const result = await db.query(
    "UPDATE users SET role='admin' WHERE email=$1 AND verified_at IS NOT NULL AND NOT suspended RETURNING id",
    [account],
  );
  if (!result.rows.length)
    throw new Error(
      "La cuenta debe existir, estar activa y haber verificado su correo.",
    );
  await db.query(
    "INSERT INTO audit_events(actor_id,action,resource_id) VALUES($1,'admin_bootstrapped',$1)",
    [result.rows[0].id],
  );
  console.log(
    "Permisos de administrador actualizados para la cuenta indicada.",
  );
} finally {
  await db.close();
}
