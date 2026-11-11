import { navigateSection, searchCampus, openConversation } from "./helpers.js";
import { test, expect } from "@playwright/test";
import { evidencePath } from "./helpers.js";

test("filtros visibles sin recorte y reinicio de criterios", async ({
  page,
}, info) => {
  if (info.project.name === "mobile")
    await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  await navigateSection(page, "Explorar");
  await page
    .getByRole("button", { name: "Mostrar filtros", exact: true })
    .click();
  const panel = page.locator(".filter-panel");
  await expect(panel).toBeVisible();
  for (const label of [
    "Carrera",
    "Categoría",
    "Modalidad",
    "Condición",
    "Disponibilidad",
    "Precio mínimo",
    "Precio máximo",
  ]) {
    const bounds = await page
      .getByLabel(label, { exact: true })
      .evaluate((element) => {
        const control = element.getBoundingClientRect();
        const container = element
          .closest(".filter-panel")
          .getBoundingClientRect();
        return {
          left: control.left,
          right: control.right,
          panelLeft: container.left,
          panelRight: container.right,
          viewport: document.documentElement.clientWidth,
        };
      });
    expect(bounds.left, label).toBeGreaterThanOrEqual(bounds.panelLeft);
    expect(bounds.right, label).toBeLessThanOrEqual(
      Math.min(bounds.viewport, bounds.panelRight) + 1,
    );
  }
  await page
    .getByLabel("Categoría", { exact: true })
    .selectOption({ label: "Libros" });
  await page
    .getByLabel("Modalidad", { exact: true })
    .selectOption({ label: "Renta" });
  await page.getByLabel("Precio mínimo", { exact: true }).fill("100");
  await page
    .getByRole("button", { name: "Limpiar filtros", exact: true })
    .click();
  await expect(page.getByLabel("Categoría", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Modalidad", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Precio mínimo", { exact: true })).toHaveValue(
    "",
  );
  await page.screenshot({
    path: evidencePath(info, "filtros-responsive"),
    fullPage: true,
  });
});
