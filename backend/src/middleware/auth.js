import { HttpError } from "./errors.js";
export const sessionCookie = "ct_session";
export function sessionMiddleware(auth) {
  return async (req, res, next) => {
    const token = req.cookies[sessionCookie];
    req.session = await auth.session(token);
    if (
      req.session &&
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      !auth.validCsrf(token, req.get("x-csrf-token"))
    )
      throw new HttpError(
        403,
        "CSRF_INVALID",
        "La sesión de seguridad cambió. Recarga la página.",
      );
    next();
  };
}
export function requireUser(req, res, next) {
  if (!req.session)
    throw new HttpError(401, "AUTH_REQUIRED", "Inicia sesión para continuar.");
  next();
}
export function requireVerified(req, res, next) {
  requireUser(req, res, () => {});
  if (!req.session.user.verified)
    throw new HttpError(
      403,
      "VERIFICATION_REQUIRED",
      "Verifica tu correo institucional para realizar esta acción.",
    );
  next();
}
export function requireAdmin(req, res, next) {
  requireUser(req, res, () => {});
  if (req.session.user.role !== "admin")
    throw new HttpError(
      403,
      "ADMIN_REQUIRED",
      "Esta acción requiere un administrador.",
    );
  next();
}
