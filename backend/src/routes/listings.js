import { Router } from "express";
import multer from "multer";
import { requireUser, requireVerified } from "../middleware/auth.js";
import { createListings } from "../services/listings.js";
import { listingControllers } from "../controllers/listings.js";

export function listingRoutes(dependencies) {
  const router = Router();
  const controller = listingControllers(createListings(dependencies));
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
  });
  router.get("/listings", controller.list);
  router.get("/listings/:id", controller.get);
  router.post("/listings", requireVerified, controller.create);
  router.patch("/listings/:id", requireVerified, controller.update);
  router.delete("/listings/:id", requireUser, controller.remove);
  router.post(
    "/listings/:id/favorites",
    requireUser,
    controller.favorite(true),
  );
  router.delete(
    "/listings/:id/favorites",
    requireUser,
    controller.favorite(false),
  );
  router.get("/me/listings", requireUser, controller.own);
  router.get("/me/favorites", requireUser, controller.favorites);
  router.post(
    "/uploads",
    requireVerified,
    upload.single("image"),
    controller.upload,
  );
  router.delete("/uploads/:id", requireUser, controller.removeUpload);
  router.get("/images/:id", controller.image);
  return router;
}
