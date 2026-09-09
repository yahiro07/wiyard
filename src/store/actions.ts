import { Point } from "@/domain/common-types";
import {
  filterUnitRelatedWires,
  getForwardDirectionWireConnectionKey,
} from "@/domain/port-helpers";
import {
  BoardUnitItem,
  kSequencerWindowId,
  PortStuff,
  UnitAddingItem,
  UnitStuff,
  WindowId,
  WindowSpec,
  WindowStatus,
} from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";
import { getNextUnitId } from "@/domain/unit-id-helper";
import { persistence } from "@/store/persistence";
import { store } from "@/store/store";
import { AddOrRemoveArrayItem, setOrDeleteValue } from "@/utils/helpers";

export const actionsInternal = {
  patchUnitAttrs(unitId: string, attrs: Partial<{ cardPosition: Point }>) {
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
  setCurrentWindowId(windowId: string | null) {
    store.setCurrentWindowId(windowId);
  },
  setWindowStatus(windowId: string, status: WindowStatus) {
    const windowSpec = store.state.windowSpecs[windowId];
    if (!windowSpec) {
      const size =
        windowId === kSequencerWindowId
          ? { width: 380 + 190, height: 300 }
          : (store.state.unitStuffs[windowId]?.viewSize ?? {
              width: 300,
              height: 200,
            });
      const newWindowSpec: WindowSpec = {
        position: { x: 0, y: 0 },
        size,
        status,
      };
      store.patchWindowSpecs({ [windowId]: newWindowSpec });
    } else {
      store.patchWindowSpecs({ [windowId]: { ...windowSpec, status } });
    }
  },
  toggleWindowMinimized(windowId: string) {
    const windowSpec = store.state.windowSpecs[windowId];
    if (!windowSpec) return;
    store.patchWindowSpecs({
      [windowId]: {
        ...windowSpec,
        status: windowSpec.status === "visible" ? "minimized" : "visible",
      },
    });
  },
  toggleWindowsEvacuated() {
    store.toggleWindowsEvacuated();
  },
  setWindowsEvacuated(evacuated: boolean) {
    store.setWindowsEvacuated(evacuated);
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
    if (store.state.currentWindowId === unitId) {
      store.setCurrentWindowId(null);
    }
    store.setMenuTargetUnitId(null);

    store.produceWindowSpecs((draft) => {
      setOrDeleteValue(draft, unitId, null);
    });
  },
  toggleMidiInEnabled() {
    store.toggleMidiInEnabled();
  },
  togglePlayback() {
    store.togglePlaying();
  },
  savePersistentState() {
    persistence.save();
  },
  patchWindowSpec(windowId: WindowId, attrs: Partial<WindowSpec>) {
    const windowSpec = store.state.windowSpecs[windowId];
    if (!windowSpec) return;
    store.setWindowSpecs((prev) => ({
      ...prev,
      [windowId]: { ...prev[windowId], ...attrs },
    }));
  },
};
