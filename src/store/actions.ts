import { WindowSpec, WindowStatus } from "@lib/window-system";
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
} from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";
import { getNextUnitId } from "@/domain/unit-id-helper";
import { getDeskAreaElement } from "@/presenter/desk-area-handlers";
import { store, windowSystem } from "@/store/store";
import {
  AddOrRemoveArrayItem,
  bottomLimit,
  setOrDeleteValue,
} from "@/utils/helpers";

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
  setWindowStatus(windowId: string, status: WindowStatus) {
    const exists = windowSystem.has(windowId);
    if (!exists) {
      const deskAreaElement = getDeskAreaElement();
      const deskAreaRect = deskAreaElement.getBoundingClientRect();

      const isSequencer = windowId === kSequencerWindowId;
      let position = { x: 0, y: 0 };
      let contentSize = { width: 300, height: 200 };
      if (isSequencer) {
        position = { x: deskAreaRect.width / 2, y: deskAreaRect.height / 2 };
        contentSize = { width: 1000, height: 600 };
      } else {
        const unitItem = store.state.unitItems.find(
          (item) => item.unitId === windowId,
        );
        if (unitItem) {
          position = unitItem.cardPosition;
        }
        const viewSize = store.state.unitStuffs[windowId]?.viewSize;
        if (viewSize) {
          contentSize.width = viewSize.width;
          contentSize.height = viewSize.height;
        }
      }
      position.y = bottomLimit(position.y, contentSize.height / 2 + 34);
      const newWindowSpec: WindowSpec = {
        position,
        contentSize,
        status,
      };
      windowSystem.add(windowId, newWindowSpec);
      windowSystem.setCurrentWindow(windowId);
    }
    windowSystem.setStatus(windowId, status);
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
    store.setMenuTargetUnitId(null);
    windowSystem.remove(unitId);
  },
  toggleMidiInEnabled() {
    store.toggleMidiInEnabled();
  },
  togglePlayback() {
    store.togglePlaying();
  },
};
