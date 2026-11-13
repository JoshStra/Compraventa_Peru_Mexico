export const emptyFilters = {
  q: "",
  career: "",
  categoryId: "",
  modality: "",
  condition: "",
  status: "available",
  minPrice: "",
  maxPrice: "",
  page: 1,
  limit: 12,
};

const views = {
  inicio: "Inicio",
  explorar: "Explorar",
  favoritos: "Favoritos",
  mensajes: "Mensajes",
  operaciones: "Operaciones",
  perfil: "Perfil",
  gestion: "Gestión",
};
const choices = {
  modality: ["sale", "rental", "exchange", "donation"],
  condition: ["new", "like_new", "good", "fair"],
  status: [
    "all",
    "available",
    "reserved",
    "sold",
    "rented",
    "exchanged",
    "donated",
  ],
};

export function readNavigation(search) {
  const params = new URLSearchParams(search);
  const filters = { ...emptyFilters };
  for (const [key, max] of [
    ["q", 100],
    ["career", 80],
  ])
    filters[key] = (params.get(key) || "").slice(0, max);
  const category = params.get("categoryId") || "";
  if (
    /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(category)
  )
    filters.categoryId = category;
  for (const [key, values] of Object.entries(choices))
    if (values.includes(params.get(key))) filters[key] = params.get(key);
  for (const key of ["minPrice", "maxPrice"]) {
    const value = params.get(key);
    if (
      value?.trim() &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0 &&
      Number(value) <= 1000000
    )
      filters[key] = value;
  }
  const page = Number(params.get("pagina"));
  if (Number.isInteger(page) && page > 0 && page <= 100000) filters.page = page;
  const slug = params.get("vista");
  return { view: Object.hasOwn(views, slug) ? views[slug] : "Inicio", filters };
}

export function navigationUrl(href, { view, filters }) {
  const url = new URL(href);
  const slug = Object.entries(views).find(([, label]) => label === view)?.[0];
  if (slug && slug !== "inicio") url.searchParams.set("vista", slug);
  else url.searchParams.delete("vista");
  for (const key of Object.keys(emptyFilters)) {
    if (key === "limit") continue;
    const param = key === "page" ? "pagina" : key;
    if (filters[key] !== emptyFilters[key])
      url.searchParams.set(param, String(filters[key]));
    else url.searchParams.delete(param);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function invalidPriceRange(filters) {
  return (
    filters.minPrice !== "" &&
    filters.maxPrice !== "" &&
    Number(filters.minPrice) > Number(filters.maxPrice)
  );
}
