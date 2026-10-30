export async function readListingImage(file) {
  if (!file) return "";
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 500 * 1024 ||
    file.size === 0
  ) {
    throw new Error("Selecciona una imagen JPG, PNG o WebP de hasta 500 KB.");
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("No se pudo leer la imagen. Intenta con otro archivo."));
    reader.readAsDataURL(file);
  });
  const binary = atob(dataUrl.split(",")[1]);
  const bytes = [...binary.slice(0, 12)].map((character) =>
    character.charCodeAt(0),
  );
  const png =
    file.type === "image/png" &&
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (byte, index) => bytes[index] === byte,
    );
  const jpeg =
    file.type === "image/jpeg" &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255;
  const webp =
    file.type === "image/webp" &&
    binary.startsWith("RIFF") &&
    binary.slice(8, 12) === "WEBP";
  if (!png && !jpeg && !webp)
    throw new Error(
      "El contenido del archivo no corresponde a una imagen compatible.",
    );
  return dataUrl;
}
