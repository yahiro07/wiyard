import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";

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
