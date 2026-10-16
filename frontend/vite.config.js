import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // El código fuente vive en src. Vite se usa para el modo de desarrollo.
  root: "src",
  plugins: [react()],
  server: { host: true },
});
