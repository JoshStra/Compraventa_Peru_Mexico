const base = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(
  /\/$/,
  "",
);
let csrfToken = null;

export class ApiError extends Error {
  constructor(status, error) {
    super(error.message || "No se pudo completar la operación.");
    Object.assign(this, { status, code: error.code, fields: error.fields });
  }
}
export async function request(
  path,
  { method = "GET", body, signal, retry = true } = {},
) {
  const form = body instanceof FormData;
  const headers = {
    ...(body && !form ? { "Content-Type": "application/json" } : {}),
    ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
  };
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers,
      credentials: "include",
      ...(body ? { body: form ? body : JSON.stringify(body) } : {}),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(0, {
      code: "NETWORK_ERROR",
      message:
        "No pudimos conectar con el servidor. Revisa tu conexión y vuelve a intentar.",
    });
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(response.status, {
      code: "INVALID_RESPONSE",
      message:
        "El servidor no respondió correctamente. Vuelve a intentar en unos momentos.",
    });
  }
  if (!response.ok) {
    if (payload.error?.code === "CSRF_INVALID" && retry) {
      await api.session();
      return request(path, { method, body, signal, retry: false });
    }
    throw new ApiError(response.status, payload.error || {});
  }
  return payload;
}
const query = (values = {}) =>
  new URLSearchParams(
    Object.entries(values).filter(([, value]) => value !== "" && value != null),
  ).toString();
export const imageUrl = (url) =>
  /^https?:/.test(base) ? new URL(url, base).href : url;
export const api = {
  async session() {
    const data = await request("/auth/session");
    csrfToken = data.csrfToken;
    return data;
  },
  async login(input) {
    const data = await request("/auth/login", { method: "POST", body: input });
    csrfToken = data.csrfToken;
    return data;
  },
  register: (body) => request("/auth/register", { method: "POST", body }),
  async logout() {
    const result = await request("/auth/logout", { method: "POST" });
    csrfToken = null;
    return result;
  },
  verify: (token) =>
    request("/auth/verify", { method: "POST", body: { token } }),
  verification: () => request("/auth/verification", { method: "POST" }),
  forgot: (email) =>
    request("/auth/password-reset", { method: "POST", body: { email } }),
  reset: (body) =>
    request("/auth/password-reset/confirm", { method: "POST", body }),
  catalog: () => request("/catalog"),
  listings: (filters, signal) =>
    request(`/listings?${query(filters)}`, { signal }),
  listing: (id) => request(`/listings/${id}`),
  own: () => request("/me/listings?limit=50"),
  favorites: (filters = { limit: 50 }) =>
    request(`/me/favorites?${query(filters)}`),
  favorite: (id, enabled) =>
    request(`/listings/${id}/favorites`, {
      method: enabled ? "POST" : "DELETE",
    }),
  saveListing: (id, body) =>
    request(id ? `/listings/${id}` : "/listings", {
      method: id ? "PATCH" : "POST",
      body,
    }),
  deleteListing: (id) => request(`/listings/${id}`, { method: "DELETE" }),
  upload: (file) => {
    const body = new FormData();
    body.set("image", file);
    return request("/uploads", { method: "POST", body });
  },
  removeUpload: (id) => request(`/uploads/${id}`, { method: "DELETE" }),
  profile: (body) => request("/me", { method: "PATCH", body }),
  publicProfile: (id) => request(`/users/${id}`),
  reports: () => request("/reports"),
  report: (body) => request("/reports", { method: "POST", body }),
  conversations: () => request("/conversations"),
  openConversation: (listingId) =>
    request("/conversations", { method: "POST", body: { listingId } }),
  messages: (id, page = 1) =>
    request(`/conversations/${id}/messages?page=${page}`),
  sendMessage: (id, body) =>
    request(`/conversations/${id}/messages`, {
      method: "POST",
      body: { body },
    }),
  operations: () => request("/operations"),
  createOperation: (body) => request("/operations", { method: "POST", body }),
  transition: (id, status) =>
    request(`/operations/${id}`, { method: "PATCH", body: { status } }),
  returnRental: (id) => request(`/operations/${id}/return`, { method: "POST" }),
  rate: (id, body) =>
    request(`/operations/${id}/ratings`, { method: "POST", body }),
  admin: () => request("/admin/overview"),
  resolve: (id, body) =>
    request(`/admin/reports/${id}`, { method: "PATCH", body }),
  suspend: (id, suspended) =>
    request(`/admin/users/${id}`, { method: "PATCH", body: { suspended } }),
  moderate: (id) => request(`/admin/listings/${id}`, { method: "DELETE" }),
  addCategory: (name) =>
    request("/admin/categories", { method: "POST", body: { name } }),
  category: (id, active) =>
    request(`/admin/categories/${id}`, { method: "PATCH", body: { active } }),
  addCareer: (name) =>
    request("/admin/careers", { method: "POST", body: { name } }),
  career: (name, active) =>
    request("/admin/careers", { method: "PATCH", body: { name, active } }),
};

export const modalityLabels = {
  sale: "Venta",
  rental: "Renta",
  exchange: "Intercambio",
  donation: "Donación",
};
export const conditionLabels = {
  new: "Nuevo",
  like_new: "Excelente",
  good: "Bueno",
  fair: "Regular",
};
export const statusLabels = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
  rented: "Rentado",
  exchanged: "Intercambiado",
  donated: "Donado",
  cancelled: "Cancelado",
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  completed: "Finalizada",
  expired: "Vencida",
};
export const money = (value) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    value,
  );
export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase();
export function decorateListing(item) {
  return {
    ...item,
    raw: item,
    modality: modalityLabels[item.modality],
    condition: conditionLabels[item.condition],
    status: statusLabels[item.status],
    rentalPrice: item.modality === "rental" ? item.price : 0,
    image:
      {
        Electrónica: "arduino",
        Laboratorio: "coat",
        Herramientas: "caliper",
        Libros: "book",
      }[item.category] || "book",
    imageUrl: item.images[0] ? imageUrl(item.images[0].url) : "",
    seller: { ...item.seller, initials: initials(item.seller.name) },
  };
}
