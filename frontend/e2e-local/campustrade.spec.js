import { test, expect } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test("catálogo, búsqueda, categorías y favoritos persistentes", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.getByRole("button", { name: "Herramientas", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Vernier digital 150 mm", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Kit Arduino Uno con sensores",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Agregar a favoritos: Vernier digital 150 mm",
      exact: true,
    })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Favoritos", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Vernier digital 150 mm", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explorar", exact: true }).click();
  await page.getByRole("textbox", { name: "Buscar artículos" }).fill("CALCULO");
  await expect(
    page.getByRole("button", {
      name: "Libro Cálculo diferencial",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Buscar artículos" })
    .fill("inexistente");
  await expect(
    page.getByRole("heading", { name: "No encontramos artículos" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("publicar, editar, reservar y finalizar con perfil actualizado", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .click();
  const form = page.getByRole("dialog");
  await form
    .getByLabel("Título", { exact: true })
    .fill("Calculadora científica Casio");
  await form.getByLabel("Precio (MXN)", { exact: true }).fill("350.50");
  await form.getByLabel("Punto de entrega").fill("Biblioteca del campus");
  await form
    .getByLabel("Descripción", { exact: true })
    .fill("Calculadora funcionando con funda y batería incluida.");
  await form
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .click();
  await expect(form).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Calculadora científica Casio",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await page
    .getByRole("button", { name: "Editar perfil", exact: true })
    .click();
  await form.getByLabel("Nombre", { exact: true }).fill("Ana López");
  await form.getByLabel("Semestre", { exact: true }).fill("5");
  await form.getByRole("button", { name: "Guardar perfil" }).click();
  await expect(page.getByRole("heading", { name: "Ana López" })).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar mis datos" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("campustrade-datos.json");
  expect(
    JSON.parse(readFileSync(await download.path(), "utf8")).profile.name,
  ).toBe("Ana López");
  await page.getByRole("button", { name: "Editar", exact: true }).click();
  await form
    .getByLabel("Título", { exact: true })
    .fill("Calculadora científica con funda");
  await form.getByRole("button", { name: "Guardar cambios" }).click();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  const status = page.getByRole("combobox", {
    name: "Estado de Calculadora científica con funda",
  });
  await status.selectOption("Reservado");
  await expect(status).toHaveValue("Reservado");
  await status.selectOption("Finalizado");
  await expect(status).toBeDisabled();
  await page.reload();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await expect(
    page.getByRole("combobox", {
      name: "Estado de Calculadora científica con funda",
    }),
  ).toHaveValue("Finalizado");
  expect(errors).toEqual([]);
});

test("mensajes y reportes locales restaurados tras recargar", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Kit Arduino Uno con sensores", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Abrir conversación", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Mensaje", exact: true })
    .fill("¿Podemos ver el kit en la biblioteca?");
  await page.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.getByRole("log")).toContainText(
    "¿Podemos ver el kit en la biblioteca?",
  );
  await page.reload();
  await page.getByRole("button", { name: "Mensajes", exact: true }).click();
  await expect(page.getByRole("log")).toContainText(
    "¿Podemos ver el kit en la biblioteca?",
  );
  await page.getByRole("button", { name: "Inicio", exact: true }).click();
  await page
    .getByRole("button", { name: "Kit Arduino Uno con sensores", exact: true })
    .click();
  await page.getByRole("button", { name: "Reportar publicación" }).click();
  await page
    .getByLabel("Describe el problema")
    .fill("Esta publicación parece estar duplicada en el catálogo.");
  await page.getByRole("button", { name: "Guardar reporte local" }).click();
  await page.getByRole("button", { name: "Perfil", exact: true }).click();
  await expect(
    page.getByText("Esta publicación parece estar duplicada en el catálogo."),
  ).toBeVisible();
});

test("validaciones, imagen y navegación por teclado", async ({ page }) => {
  await page
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .click();
  const form = page.getByRole("dialog");
  await form
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .click();
  await expect(form.getByRole("alert")).toContainText("Revisa los campos");
  await expect(form.getByLabel("Título", { exact: true })).toBeFocused();
  await form.getByLabel("Modalidad", { exact: true }).selectOption("Donación");
  await expect(form.getByLabel("Precio (MXN)", { exact: true })).toHaveCount(0);
  await form.getByLabel("Imagen opcional").setInputFiles({
    name: "foto.png",
    mimeType: "image/png",
    buffer: Buffer.from("no es una imagen"),
  });
  await expect(
    form.getByText(
      "El contenido del archivo no corresponde a una imagen compatible.",
    ),
  ).toBeVisible();
  await form.getByLabel("Imagen opcional").setInputFiles({
    name: "foto.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jO5cAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(
    form.getByRole("img", { name: "Vista previa de la publicación" }),
  ).toBeVisible();
  await form
    .getByRole("button", { name: "Publicar artículo", exact: true })
    .focus();
  await page.keyboard.press("Tab");
  await expect(
    form.getByRole("button", { name: "Cerrar", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    form.getByRole("button", { name: "Publicar artículo", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(form).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Publicar artículo", exact: true }),
  ).toBeFocused();
});

test("capturas reales y pantalla sin desbordamiento horizontal", async ({
  page,
}, info) => {
  mkdirSync("../entregables/evidencias", { recursive: true });
  await expect(
    page.getByRole("heading", {
      name: "Lo que ya no usas, alguien lo necesita.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `../entregables/evidencias/${info.project.name}-inicio.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Explorar artículos", exact: true })
    .click();
  await page.getByRole("button", { name: /Filtros, / }).click();
  await page.getByLabel("Modalidad", { exact: true }).selectOption("Renta");
  await expect(
    page.getByRole("button", { name: "Vernier digital 150 mm", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `../entregables/evidencias/${info.project.name}-filtros.png`,
    fullPage: true,
  });
});
