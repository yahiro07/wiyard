import { useState } from "react";
import { showcaseEntries } from "@/domain/showcase-entries";
import { UnitAddingItem } from "@/domain/types";
import { CatalogKey, catalog } from "@/domain/unit-entries";
import { getDeskAreaElement } from "@/presenter/desk-area-handlers";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { createDragSessionEx } from "@/utils/drag-session";

const pickerItemHandlers = {
  handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    catalogKey: CatalogKey,
  ) {
    const coordinateBaseElement = getDeskAreaElement();
    createDragSessionEx(e, { coordinateBaseElement }).run({
      onStart() {
        actions.setUnitPickerVisible(false);
      },
      onMove(pos) {
        actions.setUnitAddingItem({ catalogKey, position: pos });
      },
      onUp(pos) {
        actions.addUnit(catalogKey, pos);
      },
      onEnd() {
        actions.setUnitAddingItem(null);
      },
    });
  },
};

const UnitPicker = () => {
  const [selectedCatalogKey, setSelectedCatalogKey] =
    useState<CatalogKey | null>(null);
  const selectedItem = selectedCatalogKey && catalog[selectedCatalogKey];

  return (
    <div className="absolute-full flex-c bg-black/50">
      <div className="flex-vc">
        <div className="h-40px">{selectedItem?.name}</div>
        <div className="flex-c gap-4 flex-wrap px-6">
          {showcaseEntries.map((item) => {
            return (
              <div
                key={item.catalogKey}
                className="cursor-pointer"
                onPointerDown={(e) => {
                  const catalogKey = item.catalogKey as CatalogKey;
                  setSelectedCatalogKey(catalogKey);
                  pickerItemHandlers.handlePointerDown(e, catalogKey);
                  e.stopPropagation();
                }}
              >
                <img
                  className="h-80px"
                  src={item.thumbnailUrl}
                  alt={item.name}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const UnitAddingItemView = ({ item }: { item: UnitAddingItem }) => {
  const catalogItem = catalog[item.catalogKey];
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: item.position.x, top: item.position.y }}
    >
      <img
        className="h-100px"
        src={catalogItem.thumbnailUrl}
        alt={catalogItem.name}
      />
    </div>
  );
};

export const UnitPickerRoot = () => {
  const { unitPickerVisible, unitAddingItem } = store.useSnapshot();
  return (
    <>
      {unitPickerVisible && (
        <div onPointerDown={() => actions.setUnitPickerVisible(false)}>
          <UnitPicker />
        </div>
      )}
      {unitAddingItem && <UnitAddingItemView item={unitAddingItem} />}
    </>
  );
};
