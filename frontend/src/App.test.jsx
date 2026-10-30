import { expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import { STORAGE_KEY } from "./services/campusRepository.js";

async function fillListing(user) {
  await user.type(
    screen.getByLabelText(/^Título/),
    "Calculadora científica Casio",
  );
  await user.type(screen.getByLabelText(/^Precio \(MXN\)/), "350.50");
  await user.type(
    screen.getByLabelText(/^Punto de entrega/),
    "Biblioteca del campus",
  );
  await user.type(
    screen.getByLabelText(/^Descripción/),
    "Calculadora funcionando con funda y batería incluida.",
  );
}

it("publica sin errores de evento asíncrono y conserva el artículo al recargar", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  await user.click(screen.getByRole("button", { name: "Publicar artículo" }));
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Publicar artículo",
    }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Revisa los campos");
  await fillListing(user);
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Publicar artículo",
    }),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "Calculadora científica Casio",
      exact: true,
    }),
  ).toBeInTheDocument();
  view.unmount();
  render(<App />);
  expect(
    screen.getByRole("button", {
      name: "Calculadora científica Casio",
      exact: true,
    }),
  ).toBeInTheDocument();
});

it("muestra el error de almacenamiento sin cerrar ni borrar el formulario", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Publicar artículo" }));
  await fillListing(user);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Quota exceeded");
  });
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Publicar artículo",
    }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("No se pudo guardar");
  expect(screen.getByLabelText(/^Título/)).toHaveValue(
    "Calculadora científica Casio",
  );
});

it("filtra categorías completas y distingue la búsqueda vacía de los favoritos", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(
    screen.getByRole("button", { name: "Herramientas", exact: true }),
  );
  expect(
    screen.getByRole("button", { name: "Vernier digital 150 mm", exact: true }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", {
      name: "Kit Arduino Uno con sensores",
      exact: true,
    }),
  ).not.toBeInTheDocument();
  await user.type(
    screen.getByRole("textbox", { name: "Buscar artículos" }),
    "inexistente",
  );
  expect(
    screen.getByRole("heading", { name: "No encontramos artículos" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Aún no hay favoritos")).not.toBeInTheDocument();
});

it("guarda mensajes visibles en su conversación y los restaura al recargar", async () => {
  const user = userEvent.setup();
  const view = render(<App />);
  await user.click(
    screen.getByRole("button", {
      name: "Kit Arduino Uno con sensores",
      exact: true,
    }),
  );
  await user.click(screen.getByRole("button", { name: "Abrir conversación" }));
  await user.type(
    screen.getByRole("textbox", { name: "Mensaje", exact: true }),
    "¿Puedo verlo mañana?",
  );
  await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));
  expect(
    within(screen.getByRole("log")).getByText("¿Puedo verlo mañana?", {
      exact: false,
    }),
  ).toBeInTheDocument();
  view.unmount();
  render(<App />);
  await user.click(
    screen.getByRole("button", { name: "Mensajes", exact: true }),
  );
  expect(
    within(screen.getByRole("log")).getByText("¿Puedo verlo mañana?", {
      exact: false,
    }),
  ).toBeInTheDocument();
});

it("permite cerrar un modal con Escape y restaura el foco", async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = screen.getByRole("button", { name: "Publicar artículo" });
  await user.click(trigger);
  expect(screen.getByLabelText(/^Título/)).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("muestra errores de favoritos dentro del modal y conserva el estado", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(
    screen.getByRole("button", {
      name: "Kit Arduino Uno con sensores",
      exact: true,
    }),
  );
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Quota exceeded");
  });
  const dialog = within(screen.getByRole("dialog"));
  await user.click(
    dialog.getByRole("button", { name: "Quitar de favoritos", exact: true }),
  );
  expect(dialog.getByRole("alert")).toHaveTextContent("No se pudo guardar");
  expect(
    dialog.getByRole("button", { name: "Quitar de favoritos", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

it("detecta datos dañados sin sobrescribirlos", () => {
  localStorage.setItem(STORAGE_KEY, "bad json");
  render(<App />);
  expect(screen.getByRole("alert")).toHaveTextContent("No pudimos leer");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("bad json");
});
