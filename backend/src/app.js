import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { fail, handleError, HttpError } from "./middleware/errors.js";
import { createAuth } from "./services/auth.js";
import { createMailer } from "./services/mailer.js";
import { sessionMiddleware, requireUser } from "./middleware/auth.js";
import { authRoutes } from "./routes/auth.js";

export function createApp({ db, config, mailer = createMailer(config) }) {
  const app = express();
  const auth = createAuth({ db, config, mailer });
  app.disable("x-powered-by");
  if (config.trustProxy) app.set("trust proxy", config.trustProxy);
  app.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set("X-Request-Id", req.requestId);
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          imgSrc: ["'self'", "data:", "https:"],
          upgradeInsecureRequests: config.production ? [] : null,
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(
    cors({
      origin: (origin, done) =>
        done(null, !origin || config.origins.includes(origin)),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "64kb" }));
  app.use(cookieParser());
  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: config.testMode ? 10000 : 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        error: {
          code: "RATE_LIMIT",
          message: "Demasiadas solicitudes. Intenta más tarde.",
        },
      },
    }),
  );
  app.use("/api", (req, res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      !config.origins.includes(req.get("origin"))
    )
      return next(
        new HttpError(403, "ORIGIN_FORBIDDEN", "Origen no autorizado."),
      );
    next();
  });
  app.use("/api", sessionMiddleware(auth));
  app.use("/api/v1/auth", authRoutes({ auth, config }));
  app.patch("/api/v1/me", requireUser, async (req, res) =>
    res.json({ user: await auth.updateProfile(req.session.user.id, req.body) }),
  );
  app.get("/api/v1/health", async (req, res) => {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected", version: "0.3.0" });
  });
  app.get("/api/v1/catalog", async (req, res) => {
    const [categories, careers] = await Promise.all([
      db.query(
        "SELECT id,name,active FROM categories WHERE active ORDER BY name",
      ),
      db.query("SELECT name,active FROM careers WHERE active ORDER BY name"),
    ]);
    res.json({
      categories: categories.rows,
      careers: careers.rows.map((item) => item.name),
      emailDomains: config.domains,
    });
  });
  app.use("/api", () => fail(404, "NOT_FOUND", "Ruta no encontrada."));
  app.use(handleError);
  return app;
}
