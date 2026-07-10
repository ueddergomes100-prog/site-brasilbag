import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        sobre: resolve(__dirname, "sobre.html"),
        termos: resolve(__dirname, "termos.html"),
        privacidade: resolve(__dirname, "privacidade.html"),
        cookies: resolve(__dirname, "cookies.html")
      }
    }
  }
});
