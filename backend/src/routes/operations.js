import { Router } from "express";
import { requireUser, requireVerified } from "../middleware/auth.js";
import { createOperations } from "../services/operations.js";

export function operationRoutes(dependencies) {
  const router = Router();
  const service = createOperations(dependencies);
  router.get("/operations", requireUser, async (req, res) => {
    const items = await service.list(req.session.user);
    res.json({ items });
  });
  router.post("/operations", requireVerified, async (req, res) => {
    const operation = await service.create(req.session.user, req.body);
    res.status(201).json({ operation });
  });
  router.patch("/operations/:id", requireVerified, async (req, res) => {
    const operation = await service.transition(
      req.session.user,
      req.params.id,
      req.body,
    );
    res.json({ operation });
  });
  router.post("/operations/:id/return", requireVerified, async (req, res) => {
    res.json(await service.returnRental(req.session.user, req.params.id));
  });
  router.post("/operations/:id/ratings", requireVerified, async (req, res) => {
    const rating = await service.rate(
      req.session.user,
      req.params.id,
      req.body,
    );
    res.status(201).json({ rating });
  });
  router.get("/users/:id", async (req, res) => {
    res.json({ user: await service.publicProfile(req.params.id) });
  });
  return router;
}
