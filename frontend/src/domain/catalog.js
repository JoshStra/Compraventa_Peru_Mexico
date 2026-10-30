export const careers = [
  "Todas",
  "Automotriz",
  "Industrias Alimentarias",
  "Mecatrónica",
];
export const modalities = [
  "Todos",
  "Venta",
  "Renta",
  "Intercambio",
  "Donación",
];
export const conditions = ["Todas", "Nuevo", "Excelente", "Bueno"];
export const categories = [
  "Electrónica",
  "Laboratorio",
  "Libros",
  "Herramientas",
];
export const statuses = ["Disponible", "Reservado", "Finalizado"];
export const emptyFilters = {
  query: "",
  career: "Todas",
  modality: "Todos",
  condition: "Todas",
  category: "Todas",
  status: "Disponible",
  minPrice: "",
  maxPrice: "",
};

export function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

export function listingPrice(item) {
  return item.modality === "Renta" ? item.rentalPrice : item.price;
}

export function filterListings(listings, filters) {
  const query = normalizeText(filters.query);
  return listings.filter((item) => {
    const price = listingPrice(item);
    return (
      (!query ||
        normalizeText(
          `${item.title} ${item.description} ${item.category}`,
        ).includes(query)) &&
      (!filters.career ||
        filters.career === "Todas" ||
        item.career === filters.career) &&
      (!filters.modality ||
        filters.modality === "Todos" ||
        item.modality === filters.modality) &&
      (!filters.condition ||
        filters.condition === "Todas" ||
        item.condition === filters.condition) &&
      (!filters.category ||
        filters.category === "Todas" ||
        item.category === filters.category) &&
      (!filters.status ||
        filters.status === "Todos" ||
        item.status === filters.status) &&
      (filters.minPrice === "" ||
        filters.minPrice == null ||
        price >= Number(filters.minPrice)) &&
      (filters.maxPrice === "" ||
        filters.maxPrice == null ||
        price <= Number(filters.maxPrice))
    );
  });
}

export class ValidationError extends Error {
  constructor(fields) {
    super(Object.values(fields)[0]);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export function validateListing(input) {
  const fields = {};
  const text = (key, label, min, max) => {
    const value = String(input[key] ?? "").trim();
    if (value.length < min || value.length > max)
      fields[key] = `${label}: usa entre ${min} y ${max} caracteres.`;
    return value;
  };
  const title = text("title", "Título", 8, 100);
  const description = text("description", "Descripción", 20, 1500);
  const location = text("location", "Punto de entrega", 3, 120);
  for (const [key, allowed] of Object.entries({
    career: careers.slice(1),
    modality: modalities.slice(1),
    condition: conditions.slice(1),
    category: categories,
  })) {
    if (!allowed.includes(input[key]))
      fields[key] = "Selecciona una opción válida.";
  }
  const priced = ["Venta", "Renta"].includes(input.modality);
  const amount = Number(input.price);
  if (
    priced &&
    (String(input.price ?? "").trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000 ||
      Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001)
  ) {
    fields.price =
      "Ingresa un precio mayor a cero, hasta 1 000 000 MXN y con máximo dos decimales.";
  }
  const imageUrl = input.imageUrl || "";
  if (
    imageUrl &&
    (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(imageUrl) ||
      imageUrl.length > 700000)
  ) {
    fields.imageUrl = "Usa una imagen JPG, PNG o WebP de hasta 500 KB.";
  }
  if (Object.keys(fields).length) throw new ValidationError(fields);
  return {
    title,
    description,
    location,
    modality: input.modality,
    category: input.category,
    career: input.career,
    condition: input.condition,
    price: priced && input.modality === "Venta" ? amount : 0,
    rentalPrice: priced && input.modality === "Renta" ? amount : 0,
    image: {
      Electrónica: "arduino",
      Laboratorio: "coat",
      Libros: "book",
      Herramientas: "caliper",
    }[input.category],
    imageUrl,
  };
}
