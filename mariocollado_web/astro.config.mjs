// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpine from "@astrojs/alpinejs";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["packery"], // Incluir Packery en la optimización de dependencias de Vite
    },
  },
  integrations: [react(), alpine()],
  output: "server",
  adapter: vercel(),
  server: {
    port: 4321,
    host: "127.0.0.1",
  },
});