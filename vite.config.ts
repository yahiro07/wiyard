import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { unitLoaderPlugin } from "wus-vite-unit-loader-plugin";
import { unitSourceUrls } from "./src/unit-source-urls";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    unitLoaderPlugin({ unitSourceUrls, cacheFolderPath: "./.wus-cache" }),
  ],
  appType: "mpa",
  resolve: {
    preserveSymlinks: true,
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
  },
  server: { port: 3004 },
});
