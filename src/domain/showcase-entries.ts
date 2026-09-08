import { catalog } from "@/domain/unit-entries";

export const showcaseEntries = Object.values(catalog).filter(
  (item) => item.catalogKey !== "fluoritePianoRoll",
);
