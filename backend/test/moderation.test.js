import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { testContext, createTestUser, createTestListing } from "./helpers.js";

let context, admin, seller, reporter, listing, reportId;
before(async () => {
  context = await testContext();
  admin = await createTestUser(context, "admin");
  seller = await createTestUser(context, "seller");
  reporter = await createTestUser(context, "reporter");
  await context.db.query("UPDATE users SET role='admin' WHERE id=$1", [
    admin.user.id,
  ]);
  listing = await createTestListing(context, seller);
});
after(async () => context?.close());
test("reporte persistente evita duplicados y limita acceso administrativo", async () => {
  const response = await reporter.send("post", "/reports", {
    listingId: listing.id,
    reason: "spam",
    detail: "La publicación parece duplicada en el catálogo.",
  });
  assert.equal(response.status, 201);
  reportId = response.body.report.id;
  assert.equal(
    (
      await reporter.send("post", "/reports", {
        listingId: listing.id,
        reason: "spam",
        detail: "La publicación parece duplicada en el catálogo.",
      })
    ).status,
    409,
  );
  assert.equal((await seller.send("get", "/reports")).body.items.length, 0);
  assert.equal((await reporter.send("get", "/reports")).body.items.length, 1);
  assert.equal((await reporter.send("get", "/admin/overview")).status, 403);
});
test("administrador revisa resuelve y registra una decisión real", async () => {
  const overview = await admin.send("get", "/admin/overview");
  assert.equal(overview.status, 200);
  assert.equal(overview.body.reports[0].id, reportId);
  assert.equal(overview.body.users[0].password_hash, undefined);
  const resolved = await admin.send("patch", `/admin/reports/${reportId}`, {
    status: "resolved",
    resolution:
      "Se revisó el contenido y se retirará la publicación duplicada.",
  });
  assert.equal(resolved.status, 200);
  assert.equal(
    (await reporter.send("get", "/reports")).body.items[0].status,
    "resolved",
  );
  assert.equal(
    (
      await admin.send("patch", `/admin/reports/${reportId}`, {
        status: "reviewing",
        resolution: "No debe reabrirse el reporte cerrado.",
      })
    ).status,
    409,
  );
});
test("moderación retira contenido sin borrar su historial", async () => {
  assert.equal(
    (await reporter.send("delete", `/admin/listings/${listing.id}`)).status,
    403,
  );
  assert.equal(
    (await admin.send("delete", `/admin/listings/${listing.id}`)).status,
    200,
  );
  assert.equal(
    (await request(context.app).get(`/api/v1/listings/${listing.id}`)).status,
    404,
  );
  assert.ok(
    (
      await context.db.query("SELECT deleted_at FROM listings WHERE id=$1", [
        listing.id,
      ])
    ).rows[0].deleted_at,
  );
});
test("suspensión revoca sesiones y oculta publicaciones; no modifica administradores", async () => {
  await createTestListing(context, seller, {
    title: "Artículo que debe ocultarse",
  });
  assert.equal(
    (
      await admin.send("patch", `/admin/users/${seller.user.id}`, {
        suspended: true,
      })
    ).status,
    200,
  );
  assert.equal((await seller.send("get", "/auth/session")).body.user, null);
  assert.equal(
    (await request(context.app).get("/api/v1/listings")).body.total,
    0,
  );
  assert.equal(
    (
      await admin.send("patch", `/admin/users/${admin.user.id}`, {
        suspended: true,
      })
    ).status,
    400,
  );
});
test("categorías y carreras se administran sin modificar referencias históricas", async () => {
  const added = await admin.send("post", "/admin/categories", {
    name: "Material didáctico",
  });
  assert.equal(added.status, 201);
  assert.equal(
    (
      await admin.send("patch", `/admin/categories/${added.body.category.id}`, {
        active: false,
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await admin.send("post", "/admin/careers", {
        name: "Sistemas Computacionales",
      })
    ).status,
    201,
  );
  assert.ok(
    (await request(context.app).get("/api/v1/catalog")).body.careers.includes(
      "Sistemas Computacionales",
    ),
  );
});
