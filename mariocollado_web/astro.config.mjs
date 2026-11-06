// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "fr", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react()],
  output: "static",
  server: {
    port: 4321,
    host: "127.0.0.1",
  },
});
