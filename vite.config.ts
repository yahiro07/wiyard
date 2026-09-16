import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig, loadEnv } from "vite";
import { unitLoaderPlugin } from "wafer-host/vite-plugin";
import { getUnitSourceUrls } from "./src/unit-source-urls.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const debugUseLocalUnits = !!env.DEBUG_USE_LOCAL_UNITS;
  const unitSourceUrls = getUnitSourceUrls(debugUseLocalUnits);
  return {
    appType: "mpa",
    plugins: [
      react(),
      UnoCSS(),
      unitLoaderPlugin({ unitSourceUrls, cacheFolderPath: "./.wafer-cache" }),
    ],
    define: {
      __CfPagesUrl: JSON.stringify(process.env.CF_PAGES_URL || ""),
    },
    resolve: { tsconfigPaths: true },
    server: {
      port: 3004,
      host: "0.0.0.0",
      watch: { ignored: ["**/.wafer-cache/**"] },
    },
  };
});
