import { mockListings } from "../data/mockListings.js";
import {
  careers,
  listingPrice,
  ValidationError,
  validateListing,
  statuses,
} from "../domain/catalog.js";

export const STORAGE_KEY = "campustrade:v1";
const clone = (value) => structuredClone(value);
const defaultProfile = {
  id: "local-user",
  name: "Mi perfil",
  career: "Mecatrónica",
  semester: 1,
  initials: "MP",
  verified: false,
};

function initialState() {
  return {
    version: 1,
    profile: { ...defaultProfile },
    favorites: ["ct-001"],
    threads: [],
    reports: [],
    listings: mockListings.map((item, index) => ({
      ...clone(item),
      status: "Disponible",
      createdAt: new Date(Date.UTC(2026, 9, 14, 12 - index)).toISOString(),
      seller: { ...item.seller, id: `demo-${index + 1}` },
    })),
  };
}

function validState(state) {
  try {
    if (
      state?.version !== 1 ||
      state.profile?.id !== "local-user" ||
      typeof state.profile.name !== "string" ||
      typeof state.profile.initials !== "string" ||
      !careers.slice(1).includes(state.profile.career) ||
      !Number.isInteger(state.profile.semester) ||
      state.profile.semester < 1 ||
      state.profile.semester > 16 ||
      !Array.isArray(state.listings) ||
      !Array.isArray(state.favorites) ||
      !Array.isArray(state.threads) ||
      !Array.isArray(state.reports)
    )
      return false;
    const validListings = state.listings.every((item) => {
      validateListing({ ...item, price: listingPrice(item) });
      return (
        typeof item.id === "string" &&
        typeof item.seller?.id === "string" &&
        typeof item.seller.name === "string" &&
        typeof item.seller.initials === "string" &&
        Number.isFinite(item.seller.rating) &&
        item.seller.rating >= 0 &&
        item.seller.rating <= 5 &&
        statuses.includes(item.status)
      );
    });
    return (
      validListings &&
      new Set(state.listings.map((item) => item.id)).size ===
        state.listings.length &&
      state.favorites.every(
        (favorite) =>
          typeof favorite === "string" &&
          state.listings.some((item) => item.id === favorite),
      ) &&
      state.threads.every(
        (thread) =>
          typeof thread.id === "string" &&
          typeof thread.name === "string" &&
          typeof thread.initials === "string" &&
          typeof thread.title === "string" &&
          Array.isArray(thread.messages) &&
          thread.messages.every(
            (message) =>
              typeof message.id === "string" &&
              typeof message.body === "string" &&
              message.body.trim().length > 0 &&
              message.body.length <= 2000 &&
              !Number.isNaN(Date.parse(message.sentAt)),
          ),
      ) &&
      state.reports.every(
        (report) =>
          typeof report.id === "string" &&
          typeof report.listingId === "string" &&
          typeof report.reason === "string" &&
          typeof report.detail === "string" &&
          report.status === "Abierto",
      )
    );
  } catch {
    return false;
  }
}

export class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = "StorageError";
  }
}

// Read the latest stored snapshot before each atomic write. A failed write
// leaves the previous snapshot intact and is surfaced to the interface.
export function createCampusRepository({
  storage = () => globalThis.localStorage,
  now = () => new Date().toISOString(),
  id = () => globalThis.crypto.randomUUID(),
} = {}) {
  function read() {
    try {
      const raw = storage().getItem(STORAGE_KEY);
      if (raw === null) return initialState();
      const state = JSON.parse(raw);
      if (!validState(state)) {
        throw new Error("Invalid stored state");
      }
      return state;
    } catch {
      throw new StorageError(
        "No pudimos leer los datos de este navegador. Puedes reintentar o restablecer la demostración.",
      );
    }
  }

  function save(state) {
    try {
      storage().setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      throw new StorageError(
        "No se pudo guardar. Revisa el espacio disponible y permite el almacenamiento del sitio. Tus datos anteriores se conservaron.",
      );
    }
    return clone(state);
  }

  function mutate(change) {
    const state = read();
    change(state);
    return save(state);
  }

  return {
    getSnapshot: () => clone(read()),
    reset: () => save(initialState()),
    createListing(input) {
      const data = validateListing(input);
      return mutate((state) => {
        state.listings.unshift({
          ...data,
          id: `ct-${id()}`,
          createdAt: now(),
          posted: "Ahora",
          status: "Disponible",
          seller: { ...state.profile, rating: 0 },
        });
      });
    },
    updateListing(listingId, input) {
      const data = validateListing(input);
      return mutate((state) => {
        const item = state.listings.find((entry) => entry.id === listingId);
        if (!item || item.seller.id !== state.profile.id)
          throw new ValidationError({
            listing: "Solo puedes editar tus publicaciones.",
          });
        if (item.status === "Finalizado")
          throw new ValidationError({
            listing: "Una publicación finalizada ya no puede editarse.",
          });
        Object.assign(item, data);
      });
    },
    setListingStatus(listingId, status) {
      if (!statuses.includes(status))
        throw new ValidationError({ status: "Estado no válido." });
      return mutate((state) => {
        const item = state.listings.find((entry) => entry.id === listingId);
        if (!item || item.seller.id !== state.profile.id)
          throw new ValidationError({
            listing: "Solo puedes cambiar tus publicaciones.",
          });
        if (item.status === "Finalizado")
          throw new ValidationError({
            status: "Esta publicación ya está finalizada.",
          });
        item.status = status;
      });
    },
    toggleFavorite(listingId) {
      return mutate((state) => {
        if (!state.listings.some((item) => item.id === listingId))
          throw new ValidationError({
            listing: "La publicación ya no existe.",
          });
        state.favorites = state.favorites.includes(listingId)
          ? state.favorites.filter((entry) => entry !== listingId)
          : [...state.favorites, listingId];
      });
    },
    openThread(listingId) {
      return mutate((state) => {
        const item = state.listings.find((entry) => entry.id === listingId);
        if (!item || item.status !== "Disponible")
          throw new ValidationError({
            listing: "Esta publicación no está disponible.",
          });
        if (item.seller.id === state.profile.id)
          throw new ValidationError({
            listing:
              "Esta es tu publicación. Puedes administrarla desde tu perfil.",
          });
        if (!state.threads.some((thread) => thread.listingId === listingId)) {
          state.threads.unshift({
            id: `thread-${id()}`,
            listingId,
            name: item.seller.name,
            initials: item.seller.initials,
            title: item.title,
            messages: [],
          });
        }
      });
    },
    sendMessage(threadId, body) {
      const text = String(body ?? "").trim();
      if (!text || text.length > 2000)
        throw new ValidationError({
          body: "Escribe un mensaje de 1 a 2000 caracteres.",
        });
      return mutate((state) => {
        const thread = state.threads.find((entry) => entry.id === threadId);
        if (!thread)
          throw new ValidationError({
            thread: "Selecciona una conversación existente.",
          });
        thread.messages.push({
          id: `message-${id()}`,
          body: text,
          sentAt: now(),
          senderId: state.profile.id,
        });
      });
    },
    updateProfile(input) {
      const name = String(input.name ?? "").trim();
      const semester = Number(input.semester);
      const fields = {};
      if (name.length < 2 || name.length > 80)
        fields.name = "Escribe un nombre de 2 a 80 caracteres.";
      if (!careers.slice(1).includes(input.career))
        fields.career = "Selecciona una carrera válida.";
      if (!Number.isInteger(semester) || semester < 1 || semester > 16)
        fields.semester = "Selecciona un semestre entre 1 y 16.";
      if (Object.keys(fields).length) throw new ValidationError(fields);
      return mutate((state) => {
        state.profile = {
          ...state.profile,
          name,
          semester,
          career: input.career,
          initials: name
            .split(/\s+/)
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        };
        state.listings.forEach((item) => {
          if (item.seller.id === state.profile.id)
            Object.assign(item.seller, state.profile);
        });
      });
    },
    reportListing(listingId, input) {
      const reasons = [
        "Spam",
        "Contenido inapropiado",
        "Posible fraude",
        "Artículo prohibido",
      ];
      const detail = String(input.detail ?? "").trim();
      if (
        !reasons.includes(input.reason) ||
        detail.length < 10 ||
        detail.length > 1000
      )
        throw new ValidationError({
          report:
            "Selecciona un motivo y describe el problema con 10 a 1000 caracteres.",
        });
      return mutate((state) => {
        if (!state.listings.some((item) => item.id === listingId))
          throw new ValidationError({ listing: "La publicación no existe." });
        if (
          state.reports.some(
            (report) =>
              report.listingId === listingId && report.status === "Abierto",
          )
        )
          throw new ValidationError({
            report: "Ya tienes un reporte abierto para esta publicación.",
          });
        state.reports.unshift({
          id: `report-${id()}`,
          listingId,
          reason: input.reason,
          detail,
          status: "Abierto",
          createdAt: now(),
        });
      });
    },
  };
}

export const campusRepository = createCampusRepository();
