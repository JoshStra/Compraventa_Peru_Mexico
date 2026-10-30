import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { testContext, createTestUser, createTestListing } from "./helpers.js";

let context, seller, first, second, listing;
before(async () => {
  context = await testContext();
  seller = await createTestUser(context, "seller");
  first = await createTestUser(context, "first");
  second = await createTestUser(context, "second");
  listing = await createTestListing(context, seller);
});
after(async () => context?.close());
test("dos aceptaciones simultáneas solo reservan el artículo una vez", async () => {
  const one = await first.send("post", "/operations", {
    listingId: listing.id,
  });
  const two = await second.send("post", "/operations", {
    listingId: listing.id,
  });
  assert.equal(one.status, 201);
  assert.equal(two.status, 201);
  const results = await Promise.all([
    seller.send("patch", `/operations/${one.body.operation.id}`, {
      status: "accepted",
    }),
    seller.send("patch", `/operations/${two.body.operation.id}`, {
      status: "accepted",
    }),
  ]);
  assert.deepEqual(results.map((item) => item.status).sort(), [200, 409]);
  assert.equal(
    (
      await context.db.query(
        "SELECT count(*)::int AS count FROM operations WHERE listing_id=$1 AND status='accepted'",
        [listing.id],
      )
    ).rows[0].count,
    1,
  );
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${listing.id}`)).body.item
      .status,
    "reserved",
  );
});
test("estados terminales bloquean solicitudes y las calificaciones exigen finalización", async () => {
  const operation = (
    await context.db.query(
      "SELECT id,requester_id FROM operations WHERE status='accepted'",
    )
  ).rows[0];
  const buyer = operation.requester_id === first.user.id ? first : second;
  assert.equal(
    (
      await buyer.send("post", `/operations/${operation.id}/ratings`, {
        score: 5,
        comment: "Operación excelente",
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await buyer.send("patch", `/operations/${operation.id}`, {
        status: "completed",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await seller.send("patch", `/operations/${operation.id}`, {
        status: "completed",
      })
    ).status,
    200,
  );
  assert.equal(
    (await first.send("post", "/operations", { listingId: listing.id })).status,
    409,
  );
  assert.equal(
    (
      await buyer.send("post", `/operations/${operation.id}/ratings`, {
        score: 5,
        comment: "Entrega correcta dentro del campus",
      })
    ).status,
    201,
  );
  assert.equal(
    (
      await buyer.send("post", `/operations/${operation.id}/ratings`, {
        score: 4,
        comment: "Intento duplicado",
      })
    ).status,
    409,
  );
  const profile = (
    await request(context.app).get(`/api/v1/users/${seller.user.id}`)
  ).body.user;
  assert.equal(profile.rating, 5);
  assert.equal(profile.email, undefined);
  assert.equal(profile.ratings.length, 1);
});
test("cancelar una reserva libera disponibilidad y rechaza terceros", async () => {
  const item = await createTestListing(context, seller, {
    title: "Artículo para cancelar reserva",
  });
  const operation = (
    await first.send("post", "/operations", { listingId: item.id })
  ).body.operation;
  await seller.send("patch", `/operations/${operation.id}`, {
    status: "accepted",
  });
  assert.equal(
    (
      await second.send("patch", `/operations/${operation.id}`, {
        status: "cancelled",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await first.send("patch", `/operations/${operation.id}`, {
        status: "cancelled",
      })
    ).status,
    200,
  );
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${item.id}`)).body.item
      .status,
    "available",
  );
});
test("renta valida fechas e importe y permite registrar devolución", async () => {
  const item = await createTestListing(context, seller, {
    title: "Vernier digital para renta",
    modality: "rental",
    price: 35,
  });
  assert.equal(
    (await first.send("post", "/operations", { listingId: item.id })).status,
    400,
  );
  const start = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const end = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const response = await first.send("post", "/operations", {
    listingId: item.id,
    rentalStart: start,
    rentalEnd: end,
  });
  assert.equal(response.status, 201);
  const operation = response.body.operation;
  assert.equal(
    (await first.send("get", "/operations")).body.items.find(
      (entry) => entry.id === operation.id,
    ).amount,
    105,
  );
  await seller.send("patch", `/operations/${operation.id}`, {
    status: "accepted",
  });
  await seller.send("patch", `/operations/${operation.id}`, {
    status: "completed",
  });
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${item.id}`)).body.item
      .status,
    "rented",
  );
  assert.equal(
    (await seller.send("post", `/operations/${operation.id}/return`)).status,
    200,
  );
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${item.id}`)).body.item
      .status,
    "available",
  );
});
test("intercambio reserva ambos artículos y no permite reutilizar el ofrecido", async () => {
  const target = await createTestListing(context, seller, {
    title: "Libro disponible para intercambio",
    modality: "exchange",
    price: 0,
  });
  const offered = await createTestListing(context, first, {
    title: "Herramienta para ofrecer intercambio",
    modality: "exchange",
    price: 0,
  });
  const extra = await createTestListing(context, second, {
    title: "Otro artículo para intercambio",
    modality: "exchange",
    price: 0,
  });
  const one = await first.send("post", "/operations", {
    listingId: target.id,
    offeredListingId: offered.id,
  });
  const two = await first.send("post", "/operations", {
    listingId: extra.id,
    offeredListingId: offered.id,
  });
  const results = await Promise.all([
    seller.send("patch", `/operations/${one.body.operation.id}`, {
      status: "accepted",
    }),
    second.send("patch", `/operations/${two.body.operation.id}`, {
      status: "accepted",
    }),
  ]);
  assert.deepEqual(results.map((entry) => entry.status).sort(), [200, 409]);
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${offered.id}`)).body.item
      .status,
    "reserved",
  );
});
