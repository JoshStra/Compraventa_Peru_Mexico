import { test, expect } from "@playwright/test";
import { actor, listing, login, evidencePath } from "./helpers.js";

const clients = [];
async function person(prefix) {
  const result = await actor({ prefix });
  clients.push(result.client);
  return result;
}
test.afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.dispose()));
});

test("SEC-UI-01 contenido XSS almacenado se representa como texto en catálogo y mensajes", async ({
  page,
}, info) => {
  const seller = await person("xss-seller");
  const buyer = await person("xss-buyer");
  const payload = `${info.project.name}: <img src=x onerror="window.__securityXss=1">`;
  const description =
    "<script>window.__securityXss=2</script> Material de prueba sintético.";
  const item = await listing(seller, { title: payload, description });
  const conversation = await buyer.client.post("/api/v1/conversations", {
    headers: buyer.headers,
    data: { listingId: item.id },
  });
  expect(conversation.status()).toBe(201);
  const id = (await conversation.json()).id;
  expect(
    (
      await buyer.client.post(`/api/v1/conversations/${id}/messages`, {
        headers: buyer.headers,
        data: { body: payload },
      })
    ).status(),
  ).toBe(201);
  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });
  await page.goto("/");
  await login(page, seller.input);
  await page.getByRole("button", { name: "Explorar", exact: true }).click();
  await page.getByRole("textbox", { name: "Buscar artículos" }).fill(payload);
  await page.getByRole("button", { name: payload, exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(description);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__securityXss)).toBeUndefined();
  await page.screenshot({
    path: evidencePath(info, "security-xss-catalog"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  await page.getByRole("button", { name: "Mensajes", exact: true }).click();
  await expect(page.getByRole("log")).toContainText(payload);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.__securityXss)).toBeUndefined();
  expect(dialogs).toEqual([]);
  await page.screenshot({
    path: evidencePath(info, "security-xss-message"),
    fullPage: true,
  });
});

test("SEC-UI-02 historial de rentas ofrece devolución solo para la renta vigente", async ({
  page,
}, info) => {
  const seller = await person("rent-seller");
  const buyer = await person("rent-buyer");
  const item = await listing(seller, { modality: "rental", price: 30 });
  const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  async function rent() {
    const response = await buyer.client.post("/api/v1/operations", {
      headers: buyer.headers,
      data: { listingId: item.id, rentalStart: date, rentalEnd: date },
    });
    expect(response.status()).toBe(201);
    const id = (await response.json()).operation.id;
    for (const status of ["accepted", "completed"])
      expect(
        (
          await seller.client.patch(`/api/v1/operations/${id}`, {
            headers: seller.headers,
            data: { status },
          })
        ).status(),
      ).toBe(200);
    return id;
  }
  const old = await rent();
  expect(
    (
      await seller.client.post(`/api/v1/operations/${old}/return`, {
        headers: seller.headers,
      })
    ).status(),
  ).toBe(200);
  await rent();
  await page.goto("/");
  await login(page, seller.input);
  await page.getByRole("button", { name: "Operaciones", exact: true }).click();
  const cards = page.getByRole("article", {
    name: `Operación de ${item.title}`,
    exact: true,
  });
  await expect(cards).toHaveCount(2);
  await expect(
    cards
      .nth(0)
      .getByRole("button", { name: "Registrar devolución", exact: true }),
  ).toBeVisible();
  await expect(
    cards
      .nth(1)
      .getByRole("button", { name: "Registrar devolución", exact: true }),
  ).toHaveCount(0);
  await page.screenshot({
    path: evidencePath(info, "security-rental-history"),
    fullPage: true,
  });
});
