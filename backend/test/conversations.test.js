import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { testContext, createTestUser, createTestListing } from "./helpers.js";

let context, seller, buyer, outsider, listing, id;
before(async () => {
  context = await testContext();
  seller = await createTestUser(context, "seller");
  buyer = await createTestUser(context, "buyer");
  outsider = await createTestUser(context, "outsider");
  listing = await createTestListing(context, seller);
});
after(async () => context?.close());
test("conversación única entre participantes distintos", async () => {
  assert.equal(
    (await seller.send("post", "/conversations", { listingId: listing.id }))
      .status,
    400,
  );
  const first = await buyer.send("post", "/conversations", {
    listingId: listing.id,
  });
  assert.equal(first.status, 201);
  id = first.body.id;
  assert.equal(
    (await buyer.send("post", "/conversations", { listingId: listing.id })).body
      .id,
    id,
  );
});
test("mensaje del comprador llega al vendedor y persiste", async () => {
  const sent = await buyer.send("post", `/conversations/${id}/messages`, {
    body: " ¿Sigue disponible para entrega en biblioteca? ",
  });
  assert.equal(sent.status, 201);
  assert.equal(
    (await seller.send("get", `/conversations/${id}/messages`)).body.items[0]
      .body,
    "¿Sigue disponible para entrega en biblioteca?",
  );
  assert.equal(
    (await seller.send("get", "/conversations")).body.items[0].lastMessage,
    "¿Sigue disponible para entrega en biblioteca?",
  );
  assert.equal(
    (await context.db.query("SELECT count(*)::int AS count FROM messages"))
      .rows[0].count,
    1,
  );
});
test("bloquea lectura escritura y suplantación por terceros", async () => {
  assert.equal(
    (await outsider.send("get", `/conversations/${id}/messages`)).status,
    403,
  );
  assert.equal(
    (
      await outsider.send("post", `/conversations/${id}/messages`, {
        body: "Intrusión",
      })
    ).status,
    403,
  );
  assert.equal(
    (await buyer.send("post", `/conversations/${id}/messages`, { body: " " }))
      .status,
    400,
  );
  assert.equal(
    (
      await buyer.send("post", `/conversations/${id}/messages`, {
        body: "Texto\u0000incorrecto",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await buyer.send("post", `/conversations/${id}/messages`, {
        body: "Mensaje",
        senderId: seller.user.id,
      })
    ).status,
    400,
  );
});
