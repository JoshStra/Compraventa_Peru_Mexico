export function listingControllers(service) {
  return {
    list: async (req, res) => res.json(await service.list(req.query)),
    get: async (req, res) =>
      res.json({ item: await service.get(req.params.id) }),
    create: async (req, res) =>
      res
        .status(201)
        .json({ item: await service.create(req.session.user, req.body) }),
    update: async (req, res) =>
      res.json({
        item: await service.update(req.session.user, req.params.id, req.body),
      }),
    remove: async (req, res) =>
      res.json(await service.remove(req.session.user, req.params.id)),
    own: async (req, res) =>
      res.json(
        await service.list(
          { ...req.query, status: "all" },
          { ownerId: req.session.user.id },
        ),
      ),
    favorites: async (req, res) =>
      res.json({
        ...(await service.list(
          { ...req.query, status: "all" },
          { favoriteUserId: req.session.user.id },
        )),
        ids: await service.favoriteIds(req.session.user),
      }),
    favorite: (enabled) => async (req, res) =>
      res.json(
        await service.favorite(req.session.user, req.params.id, enabled),
      ),
    upload: async (req, res) =>
      res.status(201).json(await service.upload(req.session.user, req.file)),
    removeUpload: async (req, res) =>
      res.json(await service.removeUpload(req.session.user, req.params.id)),
    image: async (req, res) => {
      const image = await service.image(req.session?.user, req.params.id);
      res.set(
        "Cache-Control",
        image.public ? "public,max-age=300" : "private,no-store",
      );
      if (image.location.url) res.redirect(image.location.url);
      else
        res
          .type("image/webp")
          .sendFile(image.location.file, { dotfiles: "allow" });
    },
  };
}
