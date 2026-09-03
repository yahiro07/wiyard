import { createStore } from "snap-store";
import { createHostSystem } from "wafer-host/core";
import { initialUnitItems, UnitItem } from "@/ui/definitions";
import { Point } from "@/utils/drag-session";

type StoreState = {
  unitItems: UnitItem[];
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
};

export const store = createStore<StoreState>({
  unitItems: initialUnitItems,
  currentEffectUnitId: null,
  windowsEvacuated: false,
});

const actionsInternal = {
  patchUnitAttrs(
    unitId: string,
    attrs: Partial<{ cardPosition: Point; windowPosition: Point }>,
  ) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
};

export const actions = {
  setUnitCardPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { cardPosition: newPos });
  },
  setUnitWindowPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { windowPosition: newPos });
  },
  setCurrentEffectUnitId(unitId: string | null) {
    store.setCurrentEffectUnitId(unitId);
  },
  toggleWindowsEvacuated() {
    store.toggleWindowsEvacuated();
  },
  endWindowsEvacuation() {
    store.setWindowsEvacuated(false);
  },
};

export const hostSystem = createHostSystem();
