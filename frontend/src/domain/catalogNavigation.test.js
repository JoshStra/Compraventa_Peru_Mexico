import { expect, it } from "vitest";
import {
  emptyFilters,
  readNavigation,
  navigationUrl,
  invalidPriceRange,
} from "./catalogNavigation.js";

it("restaura vista, búsqueda, filtros y página desde un enlace compartido", () => {
  const state = readNavigation(
    "?vista=explorar&q=libro&career=Mecatrónica&modality=rental&condition=good&status=all&minPrice=20&maxPrice=100&pagina=2",
  );
  expect(state.view).toBe("Explorar");
  expect(state.filters).toMatchObject({
    q: "libro",
    career: "Mecatrónica",
    modality: "rental",
    condition: "good",
    status: "all",
    minPrice: "20",
    maxPrice: "100",
    page: 2,
    limit: 12,
  });
});

it("descarta parámetros fuera del contrato sin enviarlos a la API", () => {
  const state = readNavigation(
    "?vista=otra&modality=card&condition=broken&status=private&categoryId=no-uuid&pagina=-4&minPrice=Infinity&maxPrice=1000001&limit=100000",
  );
  expect(state).toEqual({ view: "Inicio", filters: { ...emptyFilters } });
  expect(readNavigation("?pagina=1.5").filters.page).toBe(1);
  expect(readNavigation("?vista=constructor").view).toBe("Inicio");
});

it("conserva enlaces de verificación, recuperación y parámetros ajenos al catálogo", () => {
  for (const hash of ["#verify=token-sintetico", "#reset=token-sintetico"]) {
    const target = navigationUrl(`http://localhost/?fuente=campus${hash}`, {
      view: "Explorar",
      filters: { ...emptyFilters, q: "diseño & libros", page: 2 },
    });
    const url = new URL(target, "http://localhost");
    expect(url.hash).toBe(hash);
    expect(url.searchParams.get("fuente")).toBe("campus");
    expect(url.searchParams.get("q")).toBe("diseño & libros");
    expect(url.searchParams.get("pagina")).toBe("2");
    expect(url.searchParams.has("page")).toBe(false);
  }
});

it("limpia los filtros de la dirección al restablecerlos", () => {
  expect(
    navigationUrl(
      "http://localhost/?vista=explorar&q=libro&minPrice=5&pagina=2#contenido",
      { view: "Inicio", filters: { ...emptyFilters } },
    ),
  ).toBe("/#contenido");
});

it("distingue un rango inválido de un límite vacío, cero o límites iguales", () => {
  expect(
    invalidPriceRange({ ...emptyFilters, minPrice: "200", maxPrice: "100" }),
  ).toBe(true);
  for (const [minPrice, maxPrice] of [
    ["", "100"],
    ["200", ""],
    ["0", "0"],
    ["100", "100"],
  ])
    expect(invalidPriceRange({ ...emptyFilters, minPrice, maxPrice })).toBe(
      false,
    );
});
