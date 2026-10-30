import { afterEach, expect, it, vi } from "vitest";
import { api, request, decorateListing } from "./apiClient.js";

afterEach(() => vi.unstubAllGlobals());
it("envía cookie y CSRF sin guardar la credencial en localStorage", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({ user: { id: "u" }, csrfToken: "csrf-test" }),
        { status: 200 },
      ),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ favorite: true }), { status: 200 }),
    );
  vi.stubGlobal("fetch", fetch);
  await api.session();
  await api.favorite("listing", true);
  expect(fetch.mock.calls[1][1]).toMatchObject({
    credentials: "include",
    method: "POST",
    headers: { "X-CSRF-Token": "csrf-test" },
  });
  expect(localStorage.length).toBe(0);
});
it("rechaza respuestas HTML sin mostrarlas como contenido de la aplicación", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response("<html>Error del proxy</html>", { status: 503 }),
      ),
  );
  await expect(request("/catalog")).rejects.toMatchObject({
    code: "INVALID_RESPONSE",
    status: 503,
  });
});
it("mapea el catálogo de API a las tarjetas sin datos inventados", () => {
  const item = decorateListing({
    id: "id",
    price: 35,
    modality: "rental",
    condition: "good",
    status: "available",
    category: "Herramientas",
    images: [],
    seller: {
      id: "user",
      name: "Ana López",
      rating: 0,
      ratingCount: 0,
      verified: false,
    },
  });
  expect(item).toMatchObject({
    modality: "Renta",
    rentalPrice: 35,
    status: "Disponible",
    seller: { initials: "AL", verified: false, ratingCount: 0 },
  });
});
