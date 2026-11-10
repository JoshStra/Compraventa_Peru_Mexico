import { test, expect } from "@playwright/test";
import { actor, login, evidencePath } from "./helpers.js";

test("rango inválido explicado y asociado sin consultar el catálogo", async ({
  page,
}, info) => {
  const invalidRequests = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.pathname === "/api/v1/listings" &&
      url.searchParams.has("maxPrice") &&
      Number(url.searchParams.get("minPrice")) >
        Number(url.searchParams.get("maxPrice"))
    )
      invalidRequests.push(url.pathname);
  });
  await page.goto("/?vista=explorar&minPrice=200&maxPrice=100");
  const error = page.getByRole("alert");
  await expect(error).toHaveText(
    "El precio mínimo no puede ser mayor que el máximo.",
  );
  for (const label of ["Precio mínimo", "Precio máximo"]) {
    const field = page.getByLabel(label, { exact: true });
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAttribute("aria-describedby", "error-precio");
  }
  expect(invalidRequests).toEqual([]);
  await page.reload();
  await expect(error).toBeVisible();
  expect(invalidRequests).toEqual([]);
  await page.screenshot({
    path: evidencePath(info, "rango-precio-accesible"),
    fullPage: true,
  });
  const response = page.waitForResponse(
    (r) =>
      r.url().includes("/api/v1/listings?") &&
      new URL(r.url()).searchParams.get("maxPrice") === "300",
  );
  await page.getByLabel("Precio máximo", { exact: true }).fill("300");
  expect((await response).ok()).toBe(true);
  await expect(error).toHaveCount(0);
  await expect(
    page.getByLabel("Precio mínimo", { exact: true }),
  ).toHaveAttribute("aria-invalid", "false");
});

test("URL conserva consulta, filtros y página al recargar y recorrer el historial", async ({
  page,
}) => {
  const loaded = page.waitForRequest(
    (r) =>
      r.url().includes("/api/v1/listings?") &&
      new URL(r.url()).searchParams.get("page") === "2",
  );
  await page.goto(
    "/?vista=explorar&q=termodinamica&modality=rental&minPrice=20&pagina=2#contenido",
  );
  await loaded;
  await expect(
    page.getByRole("heading", { name: "Explora el catálogo", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Buscar artículos", exact: true }),
  ).toHaveValue("termodinamica");
  await expect(page.getByLabel("Modalidad", { exact: true })).toHaveValue(
    "rental",
  );
  await expect(page.getByLabel("Precio mínimo", { exact: true })).toHaveValue(
    "20",
  );
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Buscar artículos", exact: true }),
  ).toHaveValue("termodinamica");
  expect(new URL(page.url()).searchParams.get("pagina")).toBe("2");
  expect(new URL(page.url()).hash).toBe("#contenido");
  await page.getByRole("button", { name: "Inicio", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Lo que ya no usas.",
  );
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Explora el catálogo", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Buscar artículos", exact: true }),
  ).toHaveValue("termodinamica");
  await page.getByLabel("Condición", { exact: true }).selectOption("good");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("pagina"))
    .toBe(null);
});

test("registro explica requisitos y permite mostrar la contraseña sin perder el valor", async ({
  page,
}, info) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Crear cuenta", exact: true })
    .click();
  await expect(dialog.getByLabel("Nombre", { exact: true })).toBeFocused();
  const password = dialog.getByLabel("Contraseña", { exact: true });
  await expect(password).toHaveAccessibleDescription("Mínimo 12 caracteres.");
  await expect(
    dialog.getByLabel("Matrícula", { exact: true }),
  ).toHaveAccessibleDescription(
    "Entre 4 y 30 caracteres: letras, números y guiones.",
  );
  await password.fill("Solo una prueba sintética 2026!");
  await dialog
    .getByRole("button", { name: "Mostrar contraseña", exact: true })
    .click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(
    dialog.getByRole("button", { name: "Ocultar contraseña", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await dialog
    .getByRole("button", { name: "Ocultar contraseña", exact: true })
    .click();
  await expect(password).toHaveAttribute("type", "password");
  await expect(password).toHaveValue("Solo una prueba sintética 2026!");
  await password.fill("");
  await page.screenshot({
    path: evidencePath(info, "registro-con-ayudas"),
    fullPage: true,
  });
  await dialog
    .getByRole("button", { name: "Ya tengo cuenta", exact: true })
    .click();
  await expect(
    dialog.getByLabel("Correo institucional", { exact: true }),
  ).toBeFocused();
  await dialog
    .getByRole("button", { name: "Olvidé mi contraseña", exact: true })
    .click();
  await expect(
    dialog.getByLabel("Correo institucional", { exact: true }),
  ).toBeFocused();
  await dialog
    .getByLabel("Correo institucional", { exact: true })
    .press("Escape");
  await expect(
    page.getByRole("button", { name: "Iniciar sesión", exact: true }),
  ).toBeFocused();
});

test("las siete opciones administrativas caben en 320 px y conservan nombres accesibles", async ({
  page,
}, info) => {
  const admin = await actor({ prefix: "design-admin" });
  try {
    expect(
      (
        await admin.client.post("/__test/admin", {
          data: { email: admin.input.email },
        })
      ).ok(),
    ).toBe(true);
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/");
    await login(page, admin.input);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(nav.getByRole("button")).toHaveCount(7);
    for (const name of [
      "Inicio",
      "Explorar",
      "Favoritos",
      "Mensajes",
      "Operaciones",
      "Perfil",
      "Gestión",
    ]) {
      const button = nav.getByRole("button", { name, exact: true });
      const box = await button.boundingBox();
      expect(box.width, name).toBeGreaterThanOrEqual(44);
      expect(box.height, name).toBeGreaterThanOrEqual(44);
      expect(box.x, name).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, name).toBeLessThanOrEqual(320.1);
    }
    expect(await nav.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    await page.getByRole("button", { name: "Gestión", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Gestión del sistema", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Reportes de contenido", exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: evidencePath(info, "administracion-320"),
      fullPage: false,
    });
  } finally {
    await admin.client.dispose();
  }
});
