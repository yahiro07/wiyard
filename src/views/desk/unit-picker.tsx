import { createDragSessionEx } from "@lib/utils/drag-session";
import { useState } from "react";
import { getGraphEditPlaneElement } from "@/common/constants";
import { showcaseEntries } from "@/domain/showcase-entries";
import { UnitAddingItem } from "@/domain/types";
import {
  CatalogKey,
  getCatalogItem,
  getCatalogItemWithFallback,
} from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";

const pickerItemHandlers = {
  handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    catalogKey: CatalogKey,
  ) {
    const coordinateBaseElement = getGraphEditPlaneElement();
    createDragSessionEx(e, { coordinateBaseElement }).run({
      onStart() {
        actions.setUnitPickerVisible(false);
        windowSystem.minimizeAll();
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
  const selectedItem = selectedCatalogKey && getCatalogItem(selectedCatalogKey);

  return (
    <div
      className="absolute-full flex-c bg-black/50 z-10"
      onPointerDown={() => actions.setUnitPickerVisible(false)}
    >
      <div className="flex-vc gap-6">
        <div className="h-20px">{selectedItem?.name}</div>
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
  const catalogItem = getCatalogItemWithFallback(item.catalogKey);
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-2"
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

export const UnitPicker_AddingItem = () => {
  const { unitAddingItem } = store.useSnapshot();
  if (!unitAddingItem) return;
  return <UnitAddingItemView item={unitAddingItem} />;
};

export const UnitPickerRoot = () => {
  const { unitPickerVisible } = store.useSnapshot();
  if (!unitPickerVisible) return;
  return <UnitPicker />;
};
