import { expect, it } from "vitest";
import { readListingImage } from "./listingImage.js";

it("rechaza archivos que solo declaran ser imágenes", async () => {
  await expect(
    readListingImage(new File(["texto"], "foto.png", { type: "image/png" })),
  ).rejects.toThrow("contenido");
});
it("rechaza formatos no permitidos y archivos grandes", async () => {
  await expect(
    readListingImage(
      new File(["<svg/>"], "foto.svg", { type: "image/svg+xml" }),
    ),
  ).rejects.toThrow("500 KB");
  await expect(
    readListingImage(
      new File([new Uint8Array(500 * 1024 + 1)], "foto.jpg", {
        type: "image/jpeg",
      }),
    ),
  ).rejects.toThrow("500 KB");
});
it("lee una firma PNG compatible como data URL", async () => {
  const png = new File(
    [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
    "foto.png",
    { type: "image/png" },
  );
  await expect(readListingImage(png)).resolves.toMatch(
    /^data:image\/png;base64,/,
  );
});
