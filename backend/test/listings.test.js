import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import sharp from "sharp";
import { testContext, createTestUser } from "./helpers.js";
import { createApp } from "../src/app.js";

let context, owner, other, unverified, input, id;
before(async () => {
  context = await testContext();
  owner = await createTestUser(context, "owner");
  other = await createTestUser(context, "other");
  unverified = await createTestUser(context, "unverified", { verified: false });
  const catalog = (await request(context.app).get("/api/v1/catalog")).body;
  input = {
    title: "Calculadora científica Casio",
    description: "Calculadora en buen estado, con funda y batería incluida.",
    location: "Biblioteca del campus",
    modality: "sale",
    condition: "good",
    price: 350.5,
    categoryId: catalog.categories[0].id,
    career: "Mecatrónica",
    imageIds: [],
  };
});
after(async () => context?.close());
test("publicar exige sesión y correo verificado; no acepta suplantar propietario", async () => {
  assert.equal(
    (
      await request(context.app)
        .post("/api/v1/listings")
        .set("Origin", context.config.origins[0])
        .send(input)
    ).status,
    401,
  );
  assert.equal((await unverified.send("post", "/listings", input)).status, 403);
  assert.equal(
    (
      await owner.send("post", "/listings", {
        ...input,
        sellerId: other.user.id,
      })
    ).status,
    400,
  );
  const result = await owner.send("post", "/listings", input);
  assert.equal(result.status, 201);
  id = result.body.item.id;
  assert.equal(result.body.item.seller.id, owner.user.id);
});
test("contenido inválido se rechaza y las consultas están parametrizadas", async () => {
  for (const bad of [
    { title: "        " },
    { description: " " },
    { price: -1 },
    { price: 0 },
    { price: 1.234 },
    { modality: "donation", price: 10 },
  ])
    assert.equal(
      (await owner.send("post", "/listings", { ...input, ...bad })).status,
      400,
    );
  const found = await request(context.app)
    .get("/api/v1/listings")
    .query({ q: "CALCULADORA", minPrice: 300, maxPrice: 400 });
  assert.equal(found.status, 200);
  assert.equal(found.body.total, 1);
  assert.equal(found.body.items[0].seller.email, undefined);
  const injection = await request(context.app)
    .get("/api/v1/listings")
    .query({ q: "'; DROP TABLE listings; --" });
  assert.equal(injection.status, 200);
  assert.equal(injection.body.total, 0);
  assert.equal(
    (await request(context.app).get("/api/v1/listings").query({ limit: 100 }))
      .status,
    400,
  );
});
test("solo el propietario edita y retira; persiste con una nueva instancia de API", async () => {
  assert.equal(
    (await other.send("patch", `/listings/${id}`, input)).status,
    403,
  );
  assert.equal((await other.send("delete", `/listings/${id}`)).status, 403);
  assert.equal(
    (
      await owner.send("patch", `/listings/${id}`, {
        ...input,
        title: "Calculadora científica con funda",
      })
    ).status,
    200,
  );
  const restarted = createApp({
    db: context.db,
    config: context.config,
    mailer: context.mailer,
  });
  assert.equal(
    (await request(restarted).get(`/api/v1/listings/${id}`)).body.item.title,
    "Calculadora científica con funda",
  );
});
test("favoritos idempotentes se conservan en PostgreSQL", async () => {
  assert.equal(
    (await other.send("post", `/listings/${id}/favorites`)).status,
    200,
  );
  await other.send("post", `/listings/${id}/favorites`);
  const favorites = await other.send("get", "/me/favorites");
  assert.equal(favorites.body.items.length, 1);
  assert.ok(favorites.body.ids.includes(id));
  assert.equal((await owner.send("get", "/me/favorites")).body.items.length, 0);
  await other.send("delete", `/listings/${id}/favorites`);
  assert.equal((await other.send("get", "/me/favorites")).body.items.length, 0);
});
test("la carga verifica MIME contenido extensión y tamaño antes de publicar", async () => {
  const upload = (user, buffer, name, type) =>
    user
      .send("post", "/uploads")
      .attach("image", buffer, { filename: name, contentType: type });
  assert.equal(
    (await upload(unverified, Buffer.from("bad"), "test.png", "image/png"))
      .status,
    403,
  );
  assert.equal(
    (await upload(owner, Buffer.from("<svg/>"), "test.png", "image/png"))
      .status,
    400,
  );
  assert.equal(
    (
      await upload(
        owner,
        Buffer.alloc(5 * 1024 * 1024 + 1),
        "test.png",
        "image/png",
      )
    ).status,
    413,
  );
  const png = await sharp({
    create: { width: 20, height: 20, channels: 3, background: "#14816a" },
  })
    .png()
    .toBuffer();
  assert.equal((await upload(owner, png, "test.jpg", "image/png")).status, 400);
  const image = await upload(owner, png, "test.png", "image/png");
  assert.equal(image.status, 201);
  const disposable = await upload(owner, png, "unused.png", "image/png");
  assert.equal(
    (await owner.send("delete", `/uploads/${disposable.body.id}`)).status,
    200,
  );
  assert.equal(
    (await owner.send("get", disposable.body.url.replace("/api/v1", "")))
      .status,
    404,
  );
  assert.equal(image.body.object_key, undefined);
  assert.equal((await request(context.app).get(image.body.url)).status, 404);
  assert.equal(
    (
      await other.send("post", "/listings", {
        ...input,
        imageIds: [image.body.id],
      })
    ).status,
    403,
  );
  const created = await owner.send("post", "/listings", {
    ...input,
    title: "Artículo con imagen validada",
    imageIds: [image.body.id],
  });
  assert.equal(created.status, 201);
  const downloaded = await request(context.app).get(image.body.url);
  assert.equal(downloaded.status, 200);
  assert.match(downloaded.headers["content-type"], /^image\/webp/);
  assert.equal(
    (await owner.send("delete", `/uploads/${image.body.id}`)).status,
    403,
  );
});
test("retirar conserva historial y excluye el artículo del catálogo", async () => {
  const result = await owner.send("delete", `/listings/${id}`);
  assert.equal(result.status, 200);
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${id}`)).status,
    404,
  );
  assert.ok(
    (
      await context.db.query("SELECT deleted_at FROM listings WHERE id=$1", [
        id,
      ])
    ).rows[0].deleted_at,
  );
});
