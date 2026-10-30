import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { requireUser, sessionCookie } from "../middleware/auth.js";

export function authRoutes({ auth, config }) {
  const router = Router();
  const cookie = {
    httpOnly: true,
    secure: config.production,
    sameSite: "lax",
    path: "/",
    maxAge: config.sessionHours * 3600000,
  };
  const sensitive = rateLimit({
    windowMs: 15 * 60000,
    limit: config.testMode ? 1000 : 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: {
        code: "AUTH_RATE_LIMIT",
        message: "Demasiados intentos. Intenta más tarde.",
      },
    },
  });
  router.get("/session", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      user: req.session?.user || null,
      csrfToken: req.session?.csrfToken || null,
      emailDeliveryConfigured: Boolean(
        (config.smtp.host && config.smtp.from) ||
        (config.resend.key && config.resend.from),
      ),
    });
  });
  router.post("/register", sensitive, async (req, res) =>
    res.status(201).json(await auth.register(req.body)),
  );
  router.post("/login", sensitive, async (req, res) => {
    const { token, ...session } = await auth.login(req.body);
    res.cookie(sessionCookie, token, cookie);
    res.set("Cache-Control", "no-store").json(session);
  });
  router.post("/logout", requireUser, async (req, res) => {
    await auth.logout(req.cookies[sessionCookie]);
    res.clearCookie(sessionCookie, { ...cookie, maxAge: undefined });
    res.json({ message: "Sesión cerrada." });
  });
  router.post("/verify", sensitive, async (req, res) =>
    res.json(await auth.consumeToken(req.body, "verify")),
  );
  router.post("/verification", sensitive, requireUser, async (req, res) =>
    res.json({ verificationSent: await auth.resend(req.session.user) }),
  );
  router.post("/password-reset", sensitive, async (req, res) =>
    res.json(await auth.requestReset(req.body)),
  );
  router.post("/password-reset/confirm", sensitive, async (req, res) =>
    res.json(await auth.consumeToken(req.body, "reset")),
  );
  return router;
}
