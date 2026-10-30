import { test, expect, request as requestFactory } from "@playwright/test";
import { mkdirSync } from "node:fs";
import {
  actor,
  identity,
  login,
  listing,
  verificationMail,
  fixtureImage,
  origin,
} from "./helpers.js";

const clients = [];
test.afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.dispose()));
});
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("registro verificación publicación con imagen y edición persistentes", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const input = identity("registro");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  let modal = page.getByRole("dialog");
  await modal
    .getByRole("button", { name: "Crear cuenta", exact: true })
    .click();
  await modal.getByLabel("Nombre", { exact: true }).fill(input.name);
  await modal
    .getByLabel("Correo institucional", { exact: true })
    .fill(input.email);
  await modal.getByLabel("Contraseña", { exact: true }).fill(input.password);
  await modal.getByLabel("Matrícula", { exact: true }).fill(input.studentId);
  await modal.getByLabel("Semestre", { exact: true }).fill("5");
  await modal
    .getByRole("button", { name: "Crear cuenta", exact: true })
    .click();
  await expect(modal.getByRole("status")).toContainText("Cuenta creada");
  const client = await requestFactory.newContext({ baseURL: origin });
  clients.push(client);
  const mail = await verificationMail(client, input.email);
  await page.goto(`/#verify=${mail.token}`);
  await page
    .getByRole("button", { name: "Verificar mi correo", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await login(page, input);
  await page
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .first()
    .click();
  modal = page.getByRole("dialog");
  const title = `Calculadora científica ${info.project.name}`;
  await modal.getByLabel("Título", { exact: true }).fill(title);
  await modal.getByLabel("Precio (MXN)", { exact: true }).fill("350.50");
  await modal
    .getByLabel("Punto de entrega", { exact: true })
    .fill("Biblioteca del campus");
  await modal
    .getByLabel("Descripción", { exact: true })
    .fill("Calculadora funcionando correctamente con funda y batería.");
  await modal
    .getByLabel("Imágenes (hasta 4)", { exact: true })
    .setInputFiles(fixtureImage);
  await expect(
    modal.getByRole("img", { name: "Imagen 1 del artículo" }),
  ).toBeVisible();
  await modal
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .click();
  await expect(modal).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: title, exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: title, exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: input.name, exact: true }),
  ).toBeVisible();
  mkdirSync("../entregables/entregable_final/evidencias", { recursive: true });
  await page.screenshot({
    path: `../entregables/entregable_final/evidencias/${info.project.name}-perfil-postgresql.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Título", { exact: true })
    .fill(`${title} actualizada`);
  await page
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: `${title} actualizada`, exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("catálogo y favoritos persisten entre sesiones del navegador", async ({
  page,
}, info) => {
  const owner = await actor({ prefix: "seller" });
  clients.push(owner.client);
  const buyer = await actor({ prefix: "buyer" });
  clients.push(buyer.client);
  const item = await listing(owner, {
    title: `Libro de cálculo ${info.project.name}`,
  });
  await login(page, buyer.input);
  await page.getByRole("button", { name: "Explorar", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Buscar artículos" })
    .fill(item.title);
  await expect(
    page.getByRole("button", { name: item.title, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: `Agregar a favoritos: ${item.title}`,
      exact: true,
    })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Favoritos", exact: true }).click();
  await expect(
    page.getByRole("button", { name: item.title, exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Iniciar sesión", exact: true }),
  ).toBeVisible();
  await login(page, buyer.input);
  await page.getByRole("button", { name: "Favoritos", exact: true }).click();
  await expect(
    page.getByRole("button", { name: item.title, exact: true }),
  ).toBeVisible();
});

test("una cuenta sin verificar no publica ni obtiene una insignia falsa", async ({
  page,
}) => {
  const student = await actor({ prefix: "pending", verified: false });
  clients.push(student.client);
  await login(page, student.input);
  await expect(
    page.getByText("Tu correo institucional está pendiente de verificación.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .first()
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Verifica tu correo institucional",
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
