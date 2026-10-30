import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCampusRepository,
  STORAGE_KEY,
  StorageError,
} from "./campusRepository.js";

const listing = {
  title: "Calculadora científica",
  description: "Calculadora en buen estado e incluye su funda original.",
  location: "Biblioteca",
  category: "Herramientas",
  career: "Mecatrónica",
  condition: "Bueno",
  modality: "Venta",
  price: "350.50",
};
let repository;
beforeEach(() => {
  localStorage.clear();
  repository = createCampusRepository();
});

describe("persistencia y administración del catálogo", () => {
  it("conserva publicaciones y favoritos al crear una sesión nueva", () => {
    const created = repository.createListing(listing).listings[0];
    repository.toggleFavorite(created.id);
    const reloaded = createCampusRepository().getSnapshot();
    expect(reloaded.listings[0]).toMatchObject({
      id: created.id,
      price: 350.5,
    });
    expect(reloaded.favorites).toContain(created.id);
    expect(reloaded.listings[0].seller.verified).toBe(false);
  });
  it("genera identificadores únicos incluso en el mismo milisegundo", () => {
    const first = repository.createListing(listing).listings[0];
    const second = repository.createListing(listing).listings[0];
    expect(first.id).not.toBe(second.id);
  });
  it("no permite modificar publicaciones de demostración ajenas", () => {
    expect(() => repository.updateListing("ct-001", listing)).toThrow(
      "Solo puedes editar",
    );
    expect(() => repository.setListingStatus("ct-001", "Finalizado")).toThrow(
      "Solo puedes cambiar",
    );
  });
  it("edita, reserva y finaliza una publicación propia sin reabrirla", () => {
    const item = repository.createListing(listing).listings[0];
    repository.updateListing(item.id, {
      ...listing,
      title: "Calculadora científica nueva",
    });
    expect(
      repository.setListingStatus(item.id, "Reservado").listings[0].status,
    ).toBe("Reservado");
    repository.setListingStatus(item.id, "Finalizado");
    expect(() => repository.setListingStatus(item.id, "Disponible")).toThrow(
      "finalizada",
    );
    expect(() => repository.updateListing(item.id, listing)).toThrow(
      "finalizada",
    );
  });
  it("no muta el estado cuando una entrada es inválida", () => {
    expect(() =>
      repository.createListing({ ...listing, title: " " }),
    ).toThrow();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it("propaga el perfil a sus publicaciones sin inventar verificación", () => {
    repository.createListing(listing);
    const state = repository.updateProfile({
      name: "Ana López",
      semester: 5,
      career: "Mecatrónica",
    });
    expect(state.profile).toMatchObject({
      name: "Ana López",
      initials: "AL",
      verified: false,
    });
    expect(state.listings[0].seller.name).toBe("Ana López");
  });
  it("no sobrescribe datos dañados silenciosamente", () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    expect(() => repository.getSnapshot()).toThrow(StorageError);
    expect(() => repository.createListing(listing)).toThrow(StorageError);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("{broken");
  });
  it("detecta un documento JSON válido con estructura incompatible", () => {
    const state = repository.createListing(listing);
    delete state.listings[0].modality;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    expect(() => repository.getSnapshot()).toThrow(StorageError);
  });
  it("informa de falta de espacio y conserva el estado anterior", () => {
    repository.createListing(listing);
    const previous = localStorage.getItem(STORAGE_KEY);
    const save = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("Quota", "QuotaExceededError");
      });
    expect(() => repository.createListing(listing)).toThrow(
      "No se pudo guardar",
    );
    save.mockRestore();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(previous);
  });
  it("lee los cambios guardados desde otra instancia antes de escribir", () => {
    const other = createCampusRepository();
    repository.createListing(listing);
    other.toggleFavorite("ct-002");
    expect(repository.getSnapshot().listings).toHaveLength(7);
  });
});

describe("mensajes y reportes locales", () => {
  it("reutiliza conversaciones y mantiene sus mensajes separados", () => {
    const first = repository.openThread("ct-001").threads[0];
    repository.openThread("ct-001");
    const second = repository.openThread("ct-002").threads[0];
    repository.sendMessage(first.id, "  ¿Sigue disponible?  ");
    const state = createCampusRepository().getSnapshot();
    expect(state.threads).toHaveLength(2);
    expect(
      state.threads.find((thread) => thread.id === first.id).messages[0].body,
    ).toBe("¿Sigue disponible?");
    expect(
      state.threads.find((thread) => thread.id === second.id).messages,
    ).toEqual([]);
  });
  it("rechaza mensajes vacíos y conversaciones inexistentes", () => {
    expect(() => repository.sendMessage("missing", " ")).toThrow(
      "Escribe un mensaje",
    );
    expect(() => repository.sendMessage("missing", "Hola")).toThrow(
      "Selecciona una conversación",
    );
  });
  it("impide abrir una conversación con una publicación propia", () => {
    const own = repository.createListing(listing).listings[0];
    expect(() => repository.openThread(own.id)).toThrow("tu publicación");
  });
  it("registra reportes válidos y evita duplicados abiertos", () => {
    const report = {
      reason: "Spam",
      detail: "Esta publicación parece estar repetida.",
    };
    expect(repository.reportListing("ct-001", report).reports[0]).toMatchObject(
      { listingId: "ct-001", status: "Abierto" },
    );
    expect(() => repository.reportListing("ct-001", report)).toThrow(
      "reporte abierto",
    );
    expect(() =>
      repository.reportListing("ct-002", { reason: "Otro", detail: " " }),
    ).toThrow();
  });
});
