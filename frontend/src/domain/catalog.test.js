import { describe, expect, it } from "vitest";
import {
  emptyFilters,
  filterListings,
  validateListing,
  ValidationError,
} from "./catalog.js";
import { mockListings } from "../data/mockListings.js";

export const validListing = {
  title: "Calculadora científica",
  description: "Calculadora en buen estado e incluye su funda original.",
  location: "Biblioteca",
  category: "Herramientas",
  career: "Mecatrónica",
  condition: "Bueno",
  modality: "Venta",
  price: "350.50",
};

describe("validación de contenido", () => {
  it("recorta espacios y conserva importes decimales", () => {
    expect(
      validateListing({ ...validListing, title: `  ${validListing.title}  ` }),
    ).toMatchObject({ title: validListing.title, price: 350.5 });
  });
  it.each([
    ["title", "        "],
    ["description", "                  "],
    ["location", " "],
    ["price", ""],
    ["price", "-2"],
    ["price", "0"],
    ["price", "Infinity"],
    ["price", "1.234"],
    ["price", "1000001"],
    ["category", "Otra"],
    ["career", "Todas"],
    ["condition", "Todas"],
    ["modality", "Todos"],
  ])("rechaza %s inválido (%s)", (key, value) => {
    expect(() => validateListing({ ...validListing, [key]: value })).toThrow(
      ValidationError,
    );
  });
  it("normaliza donaciones e intercambios sin precio", () => {
    for (const modality of ["Donación", "Intercambio"])
      expect(
        validateListing({ ...validListing, modality, price: undefined }),
      ).toMatchObject({ price: 0, rentalPrice: 0 });
  });
  it("guarda la tarifa de renta en su campo correcto", () => {
    expect(
      validateListing({ ...validListing, modality: "Renta" }),
    ).toMatchObject({ price: 0, rentalPrice: 350.5 });
  });
  it("rechaza SVG y URLs externas en las imágenes", () => {
    expect(() =>
      validateListing({
        ...validListing,
        imageUrl: "data:image/svg+xml;base64,PHN2Zz4=",
      }),
    ).toThrow(ValidationError);
    expect(() =>
      validateListing({
        ...validListing,
        imageUrl: "https://example.com/tracker.png",
      }),
    ).toThrow(ValidationError);
  });
});

describe("búsqueda y filtros combinados", () => {
  const listings = mockListings.map((item) => ({
    ...item,
    status: "Disponible",
  }));
  it("encuentra palabras sin distinguir mayúsculas ni acentos", () => {
    expect(
      filterListings(listings, { ...emptyFilters, query: "CALCULO" }).map(
        (item) => item.id,
      ),
    ).toEqual(["ct-004"]);
  });
  it("filtra la categoría completa y usa el precio diario para rentas", () => {
    expect(
      filterListings(listings, {
        ...emptyFilters,
        category: "Herramientas",
        minPrice: "30",
        maxPrice: "40",
      }).map((item) => item.id),
    ).toEqual(["ct-003"]);
  });
  it("acumula filtros y excluye publicaciones finalizadas", () => {
    expect(
      filterListings(listings, {
        ...emptyFilters,
        career: "Automotriz",
        modality: "Venta",
      }),
    ).toEqual([]);
    expect(
      filterListings([{ ...listings[0], status: "Finalizado" }], emptyFilters),
    ).toEqual([]);
  });
});
