import { Point, Size } from "@/domain/common-types";
import { defaultWindowPosition } from "@/domain/default-data";
import {
  filterUnitRelatedWires,
  getForwardDirectionWireConnectionKey,
} from "@/domain/port-helpers";
import {
  BoardUnitItem,
  PortStuff,
  UnitAddingItem,
  UnitStuff,
  WindowStatus,
} from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";
import { getNextUnitId } from "@/domain/unit-id-helper";
import { store } from "@/store/store";
import { AddOrRemoveArrayItem, setOrDeleteValue } from "@/utils/helpers";

export const actionsInternal = {
  patchUnitAttrs(
    unitId: string,
    attrs: Partial<{
      cardPosition: Point;
      windowPosition: Point;
      windowStatus: WindowStatus;
      windowSize: Size;
    }>,
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
  setCurrentWindowUnitId(unitId: string | null) {
    store.setCurrentWindowUnitId(unitId);
  },
  setUnitWindowStatus(unitId: string, status: WindowStatus) {
    actionsInternal.patchUnitAttrs(unitId, { windowStatus: status });
  },
  toggleWindowMinimized(unitId: string) {
    const unitItem = store.state.unitItems.find(
      (item) => item.unitId === unitId && item.type === "board",
    ) as BoardUnitItem | undefined;
    if (!unitItem) return;
    const currentStatus = unitItem.windowStatus;
    const nextStatus = currentStatus === "visible" ? "minimized" : "visible";
    actionsInternal.patchUnitAttrs(unitId, { windowStatus: nextStatus });
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
  patchPortStuffs(attrs: Record<string, PortStuff>) {
    store.patchPortStuffs(attrs);
  },
  removePortStuffsForUnit(unitId: string) {
    store.producePortStuffs((draft) => {
      for (const key in draft) {
        if (key.split(".")[0] === unitId) {
          delete draft[key];
        }
      }
    });
  },
  setDraggingPortKey(portKey: string | null) {
    store.setDraggingPortKey(portKey);
  },
  setPreviewDestPortKey(portKey: string | null) {
    store.setPreviewDestPortKey(portKey);
  },
  setPreviewDestPosition(position: Point | null) {
    store.setPreviewDestPosition(position);
  },
  toggleWire(sourcePortKey: string, destPortKey: string) {
    const connectionKey = getForwardDirectionWireConnectionKey(
      sourcePortKey,
      destPortKey,
    );
    store.setWireConnectionKeys((prev) =>
      AddOrRemoveArrayItem(prev, connectionKey),
    );
  },
  setUnitPickerVisible(visible: boolean) {
    store.setUnitPickerVisible(visible);
  },
  toggleUnitPickerVisible() {
    store.toggleUnitPickerVisible();
  },
  setUnitAddingItem(item: UnitAddingItem | null) {
    store.setUnitAddingItem(item);
  },
  addUnit(catalogKey: CatalogKey, position: Point) {
    const unitId = getNextUnitId(store.state.unitItems, catalogKey);
    const newUnit: BoardUnitItem = {
      type: "board",
      unitId,
      catalogKey,
      cardPosition: position,
      windowPosition: defaultWindowPosition,
      windowStatus: "none",
    };
    store.setUnitItems((prev) => [...prev, newUnit]);
  },
  setMenuTargetUnit(unitId: string | null) {
    store.setMenuTargetUnitId(unitId);
  },
  toggleMenuTargetUnit(unitId: string) {
    store.setMenuTargetUnitId((prev) => (prev === unitId ? null : unitId));
  },
  removeUnit(unitId: string) {
    const wireConnectionKeys = filterUnitRelatedWires(
      store.state.wireConnectionKeys,
      unitId,
    );
    store.setWireConnectionKeys((prev) =>
      prev.filter((key) => !wireConnectionKeys.includes(key)),
    );
    store.setUnitItems((prev) => prev.filter((item) => item.unitId !== unitId));
    if (store.state.currentWindowUnitId === unitId) {
      store.setCurrentWindowUnitId(null);
    }
    store.setMenuTargetUnitId(null);
  },
  toggleMidiInEnabled() {
    store.toggleMidiInEnabled();
  },
  togglePlayback() {
    store.togglePlaying();
  },
};
