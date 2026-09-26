import presetWind4 from "@unocss/preset-wind4";
import { defineConfig, transformerVariantGroup } from "unocss";

export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [presetWind4()],
  // theme: { colors: uiColors },
  // configDeps: ["./src/components/ui-theme.ts"],
  shortcuts: [
    {
      "flex-h": "flex",
      "flex-hs": "flex items-start",
      "flex-ha": "flex items-center",
      "flex-v": "flex flex-col",
      "flex-vl": "flex flex-col items-start",
      "flex-va": "flex flex-col items-center",
      "flex-c": "flex items-center justify-center",
      "flex-vc": "flex flex-col items-center justify-center",
      "absolute-full": "absolute inset-0",
      "absolute-center":
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      "absolute-bottom-center": "absolute bottom-0 left-1/2 -translate-x-1/2",
      "absolute-top-center": "absolute top-0 left-1/2 -translate-x-1/2",
      "absolute-left-center": "absolute left-0 top-1/2 -translate-y-1/2",
      "absolute-right-center": "absolute right-0 top-1/2 -translate-y-1/2",
      "size-full": "w-full h-full",
      "children-pointer-events-auto": "[&>*]:pointer-events-auto",
      "children-pointer-events-none": "[&>*]:pointer-events-none",
    },
    [/^bd-(.+)$/, ([, c]) => `border border-solid border-${c}`],
  ],
});
