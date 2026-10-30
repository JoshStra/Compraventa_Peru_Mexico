import { Router } from "express";
import { requireUser, requireAdmin } from "../middleware/auth.js";
import { createModeration } from "../services/moderation.js";

export function moderationRoutes(dependencies) {
  const router = Router();
  const service = createModeration(dependencies);
  router.post("/reports", requireUser, async (req, res) => {
    const report = await service.report(req.session.user, req.body);
    res.status(201).json({ report });
  });
  router.get("/reports", requireUser, async (req, res) => {
    const items = await service.ownReports(req.session.user);
    res.json({ items });
  });
  router.get("/admin/overview", requireAdmin, async (req, res) => {
    res.json(await service.overview(req.session.user));
  });
  router.patch("/admin/reports/:id", requireAdmin, async (req, res) => {
    const report = await service.resolve(
      req.session.user,
      req.params.id,
      req.body,
    );
    res.json({ report });
  });
  router.patch("/admin/users/:id", requireAdmin, async (req, res) => {
    res.json(await service.suspend(req.session.user, req.params.id, req.body));
  });
  router.delete("/admin/listings/:id", requireAdmin, async (req, res) => {
    res.json(await service.hideListing(req.session.user, req.params.id));
  });
  router.post("/admin/categories", requireAdmin, async (req, res) => {
    const category = await service.addCategory(req.session.user, req.body);
    res.status(201).json({ category });
  });
  router.patch("/admin/categories/:id", requireAdmin, async (req, res) => {
    const category = await service.setCategory(
      req.session.user,
      req.params.id,
      req.body,
    );
    res.json({ category });
  });
  router.post("/admin/careers", requireAdmin, async (req, res) => {
    const career = await service.addCareer(req.session.user, req.body);
    res.status(201).json({ career });
  });
  router.patch("/admin/careers", requireAdmin, async (req, res) => {
    const career = await service.setCareer(req.session.user, req.body);
    res.json({ career });
  });
  return router;
}
