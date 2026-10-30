import { request as requestFactory, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

export const origin = "http://127.0.0.1:4180";
export const fixtureImage = fileURLToPath(
  new URL("./fixtures/article.png", import.meta.url),
);
export function identity(prefix = "user") {
  const suffix = `${prefix}-${randomUUID().slice(0, 8)}`;
  return {
    name: `Estudiante prueba ${suffix}`,
    email: `${suffix}@campus.test`,
    studentId: `TEST-${suffix}`,
    password: "Contraseña de prueba segura 2026!",
    career: "Mecatrónica",
    semester: 5,
  };
}
export async function actor({ verified = true, prefix = "user" } = {}) {
  const input = identity(prefix);
  const client = await requestFactory.newContext({
    baseURL: origin,
    extraHTTPHeaders: {
      Origin: origin,
      "x-test-key": process.env.E2E_TEST_KEY,
    },
  });
  const registered = await client.post("/api/v1/auth/register", {
    data: input,
  });
  expect(registered.status()).toBe(201);
  if (verified) {
    const mail = await verificationMail(client, input.email);
    expect(
      (
        await client.post("/api/v1/auth/verify", {
          data: { token: mail.token },
        })
      ).status(),
    ).toBe(200);
  }
  const session = await client.post("/api/v1/auth/login", {
    data: { email: input.email, password: input.password },
  });
  expect(session.status()).toBe(200);
  const data = await session.json();
  return {
    client,
    input,
    user: data.user,
    headers: { "X-CSRF-Token": data.csrfToken },
  };
}
export async function verificationMail(client, email) {
  const response = await client.get(
    `/__test/mail?to=${encodeURIComponent(email)}`,
    { headers: { "x-test-key": process.env.E2E_TEST_KEY } },
  );
  expect(response.status()).toBe(200);
  return (await response.json()).items.findLast(
    (item) => item.purpose === "verify",
  );
}
export async function login(page, input) {
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await modal
    .getByLabel("Correo institucional", { exact: true })
    .fill(input.email);
  await modal.getByLabel("Contraseña", { exact: true }).fill(input.password);
  await modal.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(modal).toHaveCount(0);
}
export async function listing(owner, overrides = {}) {
  const catalog = await (await owner.client.get("/api/v1/catalog")).json();
  const data = {
    title: `Artículo de prueba ${randomUUID().slice(0, 8)}`,
    description:
      "Material académico de prueba en buen estado y listo para entregar.",
    location: "Biblioteca del campus",
    career: "Mecatrónica",
    condition: "good",
    modality: "sale",
    price: 120,
    categoryId: catalog.categories[0].id,
    imageIds: [],
    ...overrides,
  };
  const response = await owner.client.post("/api/v1/listings", {
    headers: owner.headers,
    data,
  });
  expect(response.status()).toBe(201);
  return (await response.json()).item;
}
