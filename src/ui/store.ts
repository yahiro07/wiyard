import { createStore, Store } from "snap-store";
import { createHostSystem } from "wafer-host/core";
import { initialUnitItems, UnitItem } from "@/ui/definitions";
import { Point } from "@/utils/drag-session";

type StoreState = {
  unitItems: UnitItem[];
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
};

// biome-ignore lint/suspicious/noAssignInExpressions: preserve store instance for hmr
export const store = ((window as any).store ??= createStore<StoreState>({
  unitItems: initialUnitItems,
  currentEffectUnitId: null,
  windowsEvacuated: false,
})) as Store<StoreState>;

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
