import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";

export const actionsInternal = {
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
  setCurrentEffectUnitId(unitId: string | null) {
    store.setCurrentEffectUnitId(unitId);
  },
  toggleWindowsEvacuated() {
    store.toggleWindowsEvacuated();
  },
  setWindowsEvacuated(evacuated: boolean) {
    store.setWindowsEvacuated(evacuated);
  },
  setSequencerWindowVisible(visible: boolean) {
    store.setSequencerWindowVisible(visible);
  },
  toggleSequencerWindowVisible() {
    store.toggleSequencerWindowVisible();
  },
  setCurrentNoteChannelId(noteChannelId: string) {
    store.setCurrentNoteChannelId(noteChannelId);
  },
};
