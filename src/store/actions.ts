import { UnitStuff } from "@/domain/types";
import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";
import { setOrDeleteValue } from "@/utils/helpers";

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
  setUnitStuff(unitId: string, stuff: UnitStuff | null) {
    store.produceUnitStuffs((draft) => {
      setOrDeleteValue(draft, unitId, stuff);
    });
  },
  setPortRelativePosition(portKey: string, position: Point | null) {
    store.producePortRelativePositions((draft) => {
      setOrDeleteValue(draft, portKey, position);
    });
  },
};
