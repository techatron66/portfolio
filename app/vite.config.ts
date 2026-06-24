import path from "path"
import fs from "fs"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: "github-pages-spa-fallback",
      closeBundle() {
        const dist = path.resolve(__dirname, "dist")
        const index = path.join(dist, "index.html")
        const fallback = path.join(dist, "404.html")

        if (fs.existsSync(index)) {
          fs.copyFileSync(index, fallback)
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
