import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { fail, handleError } from "./middleware/errors.js";

export function createApp({ db, config }) {
  const app = express();
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
        directives: { imgSrc: ["'self'", "data:", "https:"] },
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
        new (class extends Error {
          constructor() {
            super("Origen no autorizado.");
            this.status = 403;
            this.code = "ORIGIN_FORBIDDEN";
          }
        })(),
      );
    next();
  });
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
