import { useState } from "react";
import { CatalogKey, catalog } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

const UnitPicker = () => {
  const catalogItems = Object.values(catalog);
  const [selectedCatalogKey, setSelectedCatalogKey] =
    useState<CatalogKey | null>(null);
  const selectedItem = selectedCatalogKey && catalog[selectedCatalogKey];

  return (
    <div className="absolute-full flex-c bg-black/50">
      <div className="flex-vc">
        <div className="h-40px">{selectedItem?.name}</div>
        <div className="flex-h gap-2">
          {catalogItems.map((item) => {
            return (
              <div
                key={item.catalogKey}
                className="cursor-pointer"
                onPointerDown={(e) => {
                  // actions.setUnitPickerVisible(false);
                  setSelectedCatalogKey(item.catalogKey as CatalogKey);
                  e.stopPropagation();
                }}
              >
                <img src={item.thumbnailUrl} alt={item.name} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const UnitPickerRoot = () => {
  const { unitPickerVisible } = store.useSnapshot();
  if (!unitPickerVisible) return null;
  return (
    <div onPointerDown={() => actions.setUnitPickerVisible(false)}>
      <UnitPicker />
    </div>
  );
};
