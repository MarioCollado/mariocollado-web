// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpine from "@astrojs/alpinejs";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["packery"], // Incluir Packery en la optimización de dependencias de Vite
    },
  },

  integrations: [react(), alpine()],
});
