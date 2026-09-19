import { allCatalogItems } from "@/domain/unit-entries";

export const showcaseEntries = allCatalogItems.filter(
  (item) => item.catalogKey !== "fluoritePianoRoll",
);
