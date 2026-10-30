import { Router } from "express";
import { requireUser, requireVerified } from "../middleware/auth.js";
import { createConversations } from "../services/conversations.js";

export function conversationRoutes(dependencies) {
  const router = Router();
  const service = createConversations(dependencies);
  router.get("/conversations", requireUser, async (req, res) =>
    res.json({ items: await service.list(req.session.user) }),
  );
  router.post("/conversations", requireVerified, async (req, res) =>
    res.status(201).json(await service.open(req.session.user, req.body)),
  );
  router.get("/conversations/:id/messages", requireUser, async (req, res) =>
    res.json(
      await service.messages(req.session.user, req.params.id, req.query),
    ),
  );
  router.post(
    "/conversations/:id/messages",
    requireVerified,
    async (req, res) =>
      res
        .status(201)
        .json({
          message: await service.send(
            req.session.user,
            req.params.id,
            req.body,
          ),
        }),
  );
  return router;
}
