import { navigateSection, searchCampus, openConversation } from "./helpers.js";
import { test, expect } from "@playwright/test";
import { actor, listing, login, origin, evidencePath } from "./helpers.js";
const clients = [];
test.afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.dispose()));
});
async function person(prefix) {
  const result = await actor({ prefix });
  clients.push(result.client);
  return result;
}
async function open(page, item) {
  await navigateSection(page, "Explorar");
  await searchCampus(page, item.title);
  await page.getByRole("button", { name: item.title, exact: true }).click();
}
async function confirm(page) {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test("mensajes entre dos sesiones y venta con calificación", async ({
  page,
  browser,
}, info) => {
  const seller = await person("vendedor"),
    buyer = await person("comprador");
  const item = await listing(seller);
  const other = await browser.newContext({ viewport: page.viewportSize() });
  const owner = await other.newPage();
  try {
    await page.goto("/");
    await login(page, buyer.input);
    await open(page, item);
    await page
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    await page
      .getByRole("textbox", { name: "Mensaje", exact: true })
      .fill("¿Podemos entregar en la biblioteca?");
    await page
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    await expect(page.getByRole("log")).toContainText(
      "¿Podemos entregar en la biblioteca?",
    );
    await owner.goto(origin);
    await login(owner, seller.input);
    await navigateSection(owner, "Mensajes");
    await openConversation(owner, item.title);
    await expect(owner.getByRole("log")).toContainText(
      "¿Podemos entregar en la biblioteca?",
    );
    await owner
      .getByRole("textbox", { name: "Mensaje", exact: true })
      .fill("Sí, nos vemos en la biblioteca.");
    await owner
      .getByRole("button", { name: "Enviar mensaje", exact: true })
      .click();
    await expect(page.getByRole("log")).toContainText(
      "Sí, nos vemos en la biblioteca.",
      { timeout: 15000 },
    );
    const geometry = await page.locator(".conversation").evaluate((el) => ({
      headerBottom: el.querySelector("header").getBoundingClientRect().bottom,
      articleTop: el.querySelector(".chat-article").getBoundingClientRect().top,
      composerHeight: el
        .querySelector(".message-composer")
        .getBoundingClientRect().height,
      composerBottom: el
        .querySelector(".message-composer")
        .getBoundingClientRect().bottom,
      viewportHeight: innerHeight,
    }));
    expect(geometry.articleTop).toBeGreaterThanOrEqual(
      geometry.headerBottom - 1,
    );
    expect(geometry.composerHeight).toBeGreaterThanOrEqual(84);
    if (info.project.name === "mobile") {
      expect(geometry.composerBottom).toBeCloseTo(geometry.viewportHeight, 0);
      await expect(
        page.getByRole("navigation", {
          name: "Navegación principal",
          exact: true,
        }),
      ).not.toBeVisible();
    }
    await page.screenshot({
      path: evidencePath(info, "mensajes"),
      fullPage: false,
    });
    await open(page, item);
    await page
      .getByRole("button", { name: "Solicitar artículo", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Enviar solicitud", exact: true })
      .click();
    let card = page.getByRole("article", {
      name: `Operación de ${item.title}`,
      exact: true,
    });
    await expect(card).toContainText("Pendiente");
    await navigateSection(owner, "Operaciones");
    const sellerCard = owner.getByRole("article", {
      name: `Operación de ${item.title}`,
      exact: true,
    });
    await sellerCard
      .getByRole("button", { name: "Aceptar solicitud", exact: true })
      .click();
    await confirm(owner);
    await expect(sellerCard).toContainText("Aceptada");
    await sellerCard
      .getByRole("button", { name: "Finalizar operación", exact: true })
      .click();
    await confirm(owner);
    await expect(sellerCard).toContainText("Finalizada");
    await page
      .getByRole("button", { name: "Actualizar operaciones", exact: true })
      .click();
    await card.getByRole("button", { name: "Calificar", exact: true }).click();
    await page
      .getByLabel("Comentario", { exact: true })
      .fill("Entrega puntual y material en buen estado.");
    await page
      .getByRole("button", { name: "Guardar calificación", exact: true })
      .click();
    await expect(card).toContainText("Calificación registrada");
    await page.screenshot({
      path: evidencePath(info, "operacion-finalizada"),
      fullPage: true,
    });
    const result = await (
      await seller.client.get(`/api/v1/users/${seller.user.id}`)
    ).json();
    expect(result.user.rating).toBe(5);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await other.close();
  }
});

test("reporte y resolución real desde la administración", async ({
  page,
}, info) => {
  const seller = await person("reportado"),
    reporter = await person("reportante"),
    admin = await person("administrador");
  const item = await listing(seller);
  expect(
    (
      await admin.client.post("/__test/admin", {
        data: { email: admin.input.email },
      })
    ).status(),
  ).toBe(200);
  await page.goto("/");
  await login(page, reporter.input);
  await open(page, item);
  await page
    .getByRole("button", { name: "Reportar publicación", exact: true })
    .click();
  await page
    .getByLabel("Describe el problema", { exact: true })
    .fill("La descripción necesita revisión por contenido incorrecto.");
  await page
    .getByRole("button", { name: "Enviar reporte", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await navigateSection(page, "Perfil");
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await login(page, admin.input);
  await navigateSection(page, "Gestión");
  const report = page
    .getByRole("listitem")
    .filter({ hasText: item.title })
    .filter({
      has: page.getByRole("button", { name: "Revisar reporte", exact: true }),
    });
  await report
    .getByRole("button", { name: "Revisar reporte", exact: true })
    .click();
  await page
    .getByLabel("Estado del reporte", { exact: true })
    .selectOption("resolved");
  await page
    .getByLabel("Resolución", { exact: true })
    .fill("Se revisó el contenido y se documentó la aclaración.");
  await page
    .getByRole("button", { name: "Guardar resolución", exact: true })
    .click();
  await expect(report).toHaveCount(0);
  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: item.title })
      .getByText(
        "Resolución: Se revisó el contenido y se documentó la aclaración.",
        { exact: true },
      ),
  ).toBeVisible();
  await page
    .getByRole("listitem")
    .filter({ hasText: item.title })
    .getByText(
      "Resolución: Se revisó el contenido y se documentó la aclaración.",
      { exact: true },
    )
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: evidencePath(info, "administracion"),
    fullPage: false,
  });
  await navigateSection(page, "Perfil");
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await login(page, reporter.input);
  await navigateSection(page, "Perfil");
  await expect(
    page.getByText(
      "Resolución: Se revisó el contenido y se documentó la aclaración.",
      { exact: true },
    ),
  ).toBeVisible();
});
