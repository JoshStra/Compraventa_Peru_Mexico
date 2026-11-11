import { expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MinimalHeader } from "./MinimalHeader.jsx";

const defaults = {
  view: "Inicio",
  query: "",
  onSearch: vi.fn(),
  onNavigate: vi.fn(),
  onPublish: vi.fn(),
  onAuth: vi.fn(),
  onLogout: vi.fn(),
};

it("envía una búsqueda desde la barra y sincroniza el texto de una URL restaurada", async () => {
  const user = userEvent.setup(),
    onSearch = vi.fn();
  const view = render(<MinimalHeader {...defaults} onSearch={onSearch} />);
  const input = screen.getByRole("textbox", { name: "Buscar en el campus" });
  await user.type(input, "Libros de cálculo{Enter}");
  expect(onSearch).toHaveBeenCalledWith("Libros de cálculo");
  view.rerender(
    <MinimalHeader {...defaults} onSearch={onSearch} query="Herramientas" />,
  );
  expect(input).toHaveValue("Herramientas");
});

it("el menú admite teclado y devuelve el foco al avatar al cerrarse", async () => {
  const user = userEvent.setup(),
    onNavigate = vi.fn();
  render(
    <MinimalHeader
      {...defaults}
      user={{ initials: "AP", role: "admin" }}
      onNavigate={onNavigate}
    />,
  );
  const avatar = screen.getByRole("button", { name: "Abrir mi perfil" });
  await user.click(avatar);
  const menu = screen.getByRole("menu", { name: "Cuenta" });
  expect(
    within(menu).getByRole("menuitem", { name: "Mi perfil" }),
  ).toHaveFocus();
  await user.keyboard("{End}");
  expect(
    within(menu).getByRole("menuitem", { name: "Cerrar sesión" }),
  ).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(avatar).toHaveFocus();
  await user.click(avatar);
  await user.click(screen.getByRole("menuitem", { name: "Gestión" }));
  expect(onNavigate).toHaveBeenCalledWith("Gestión");
});

it("conserva los accesos de estudiante y muestra las novedades sin cambiar el nombre Mensajes", async () => {
  const user = userEvent.setup();
  render(
    <MinimalHeader
      {...defaults}
      user={{ initials: "EP", role: "student" }}
      unread
    />,
  );
  const header = within(screen.getByRole("banner"));
  expect(
    header.getByRole("button", { name: "Mensajes", exact: true }),
  ).toHaveAttribute("title", "Mensajes nuevos");
  await user.click(header.getByRole("button", { name: "Abrir mi perfil" }));
  expect(
    screen.queryByRole("menuitem", { name: "Gestión" }),
  ).not.toBeInTheDocument();
  for (const name of [
    "Favoritos",
    "Operaciones",
    "Mis publicaciones",
    "Verificación de cuenta",
  ])
    expect(screen.getByRole("menuitem", { name, exact: true })).toBeVisible();
});
