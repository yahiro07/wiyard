import { CatalogKey, getCatalogItem } from "@/domain/unit-entries";

export const controlEffectUnitGetters = {
  isUnitControlEffectDefaultEnabled(catalogKey: CatalogKey) {
    const catalogItem = getCatalogItem(catalogKey);
    return catalogItem?.unitType === "instrument";
  },
  isUnitControlEffectCompatible(catalogKey: CatalogKey) {
    const catalogItem = getCatalogItem(catalogKey);
    return (
      catalogItem?.unitType === "instrument" ||
      catalogItem?.unitType === "effect"
    );
  },
  getControlEffectUnitId(unitId: string) {
    return `${unitId}_controlEffect`;
  },
};
