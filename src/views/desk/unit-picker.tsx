import { createDragSessionEx } from "@lib/utils/drag-session";
import { useState } from "react";
import { showcaseEntries } from "@/domain/showcase-entries";
import { UnitAddingItem } from "@/domain/types";
import {
  CatalogKey,
  getCatalogItem,
  getCatalogItemWithFallback,
} from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";
import { Point } from "@lib/utils/common-types";
import { domGetters } from "@/common/dom-ids";
import { cardPlacementHelper } from "@/store/card-placement-helper";
import { UnitControlEffectBar } from "@/views/unit-card/unit-cards";
import { controlEffectUnitGetters } from "@/store/control-effect-unit-getters";

const pickerItemHandlers = {
  handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    catalogKey: CatalogKey,
  ) {
    const coordinateBaseElement = domGetters.getDomGraphEditPlane();

    const getCardPosition = (domPosition: Point) => {
      const pos = { x: domPosition.x, y: domPosition.y };
      return cardPlacementHelper.clampCardPositionInGraphPlane(pos);
    };

    let cancelled = false;

    const dragSession = createDragSessionEx(e, { coordinateBaseElement });
    const keyboardHandlers = {
      handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          cancelled = true;
          actions.setUnitAddingItem(null);
        }
      },
      setup() {
        window.addEventListener("keydown", keyboardHandlers.handleKeyDown);
      },
      cleanup() {
        window.removeEventListener("keydown", keyboardHandlers.handleKeyDown);
      },
    };
    keyboardHandlers.setup();

    dragSession.run({
      onStart() {
        actions.setUnitPickerVisible(false);
        windowSystem.minimizeAll();
      },
      onMove(pos) {
        if (cancelled) return;
        actions.setUnitAddingItem({
          catalogKey,
          position: getCardPosition(pos),
        });
      },
      onUp(pos) {
        if (cancelled) return;
        actions.addUnit(catalogKey, getCardPosition(pos));
      },
      onEnd() {
        actions.setUnitAddingItem(null);
        keyboardHandlers.cleanup();
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
      <div className="flex-vc gap-6 w-90%">
        <div className="h-20px text-white">{selectedItem?.name}</div>
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
                <div className="h-80px max-w-140px">
                  <img
                    className="h-full object-cover"
                    style={{ objectPosition: "left" }}
                    src={item.thumbnailUrl}
                    alt={item.name}
                  />
                </div>
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
  const isControlEffectDefaultEnabled =
    controlEffectUnitGetters.isUnitControlEffectDefaultEnabled(item.catalogKey);
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-2 pointer-events-none"
      style={{ left: item.position.x, top: item.position.y }}
    >
      <div className="h-100px flex-ha rounded-3px shadow-md overflow-hidden bg-#aaa">
        <img
          className="h-full min-w-100px max-w-180px object-cover"
          style={{ objectPosition: "left" }}
          src={catalogItem.thumbnailUrl}
          alt={catalogItem.name}
        />
        {isControlEffectDefaultEnabled && (
          <UnitControlEffectBar
            unitId=""
            unitControlEffect={{ volume: 0.5, pan: 0 }}
          />
        )}
      </div>
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
