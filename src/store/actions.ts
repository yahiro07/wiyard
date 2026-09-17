import { KeyName } from "@lib/contract";
import { setOrDeleteValue } from "@lib/utils/array-object-helper";
import { Point } from "@lib/utils/common-types";
import { WindowSpec, WindowStatus } from "@lib/window-system";
import { boardSize, getDeskAreaElement } from "@/common/constants";
import {
  filterUnitRelatedWires,
  getForwardDirectionWireConnectionKey,
} from "@/domain/port-helpers";
import {
  AutomationEditorUnitItem,
  BoardUnitItem,
  NoteInputPortUnitItem,
  PortStuff,
  UnitAddingItem,
  UnitStuff,
  windowIds,
} from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";
import { unitIdHelper } from "@/domain/unit-id-helper";
import { notePortGetters } from "@/store/note-port-getters";
import { store, windowSystem } from "@/store/store";
import { resultOf } from "@lib/utils/general-helper";
import { commonGetters } from "@/store/common-getters";

const unitWindowInitialSizes = {
  sequencerWindow: { width: 1000, height: 600 },
  keyboardWindow: { width: 480, height: 154 },
  automationEditorWindow: { width: 900, height: 220 },
  general: {
    targetHeight: 280,
  },
};

const helpers = {
  getGeneralUnitInitialSize(windowId: string) {
    const viewSize = store.state.unitStuffs[windowId]?.viewSize;
    if (viewSize) {
      const { targetHeight } = unitWindowInitialSizes.general;
      const scale = targetHeight / viewSize.height;
      return {
        width: viewSize.width * scale,
        height: viewSize.height * scale,
      };
    } else {
      return { width: 300, height: 200 };
    }
  },
  createInitialWIndowSpec(
    windowId: string,
    status: WindowStatus,
    deskAreaRect: DOMRect,
  ) {
    const isSequencer = windowId === windowIds.sequencer;
    const isKeyboard = windowId === windowIds.keyboard;
    const isAutomationEditor = windowId === windowIds.automationEditor;

    let position = { x: deskAreaRect.width / 2, y: deskAreaRect.height / 2 };
    let contentSize = resultOf(() => {
      if (isSequencer) {
        return unitWindowInitialSizes.sequencerWindow;
      } else if (isKeyboard) {
        return unitWindowInitialSizes.keyboardWindow;
      } else if (isAutomationEditor) {
        return unitWindowInitialSizes.automationEditorWindow;
      } else {
        return helpers.getGeneralUnitInitialSize(windowId);
      }
    });
    // position.y = bottomLimit(position.y, contentSize.height / 2 + 34);
    const newWindowSpec: WindowSpec = {
      position,
      contentSize,
      status,
      ...(isSequencer ? { freeRatio: true, pinned: true } : {}),
      ...(isKeyboard ? { pinned: true } : {}),
      ...(isAutomationEditor ? { freeRatio: true, pinned: true } : {}),
    };
    return newWindowSpec;
  },
  _getNextPortCardPosition() {
    const items = store.state.unitItems.filter(
      (it) => it.type === "noteInput" || it.type === "automationEditor",
    );
    const lastItem = items.at(-1);
    return lastItem
      ? { x: lastItem.cardPosition.x, y: lastItem.cardPosition.y + 100 }
      : { x: boardSize.width / 2, y: boardSize.height / 2 };
  },
  createNoteChannelPort(): NoteInputPortUnitItem {
    const unitId = unitIdHelper.getNextNoteInputPortUnitId(
      store.state.unitItems,
    );
    const sequencerClassKey = "pianoRoll";
    const cardPosition = helpers._getNextPortCardPosition();
    return { type: "noteInput", unitId, sequencerClassKey, cardPosition };
  },
  createAutomationEditorUnit(): AutomationEditorUnitItem {
    const unitId = unitIdHelper.getNextAutomationEditorUnitId(
      store.state.unitItems,
    );
    const cardPosition = helpers._getNextPortCardPosition();
    return { type: "automationEditor", unitId, cardPosition };
  },
};

export const actionsInternal = {
  patchUnitAttrs(unitId: string, attrs: Partial<{ cardPosition: Point }>) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
  removeWires(wireConnectionKeys: string[]) {
    store.setWireConnectionKeys((prev) =>
      prev.filter((key) => !wireConnectionKeys.includes(key)),
    );
    store.produceWireGains((draft) => {
      for (const key of wireConnectionKeys) {
        delete draft[key];
      }
    });
    store.produceWireAutomationParameterIds((draft) => {
      for (const key of wireConnectionKeys) {
        delete draft[key];
      }
    });
  },
};

export const actions = {
  setUnitCardPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { cardPosition: newPos });
  },
  setWindowStatus(windowId: string, status: WindowStatus) {
    const exists = windowSystem.has(windowId);
    if (!exists) {
      const deskArea = getDeskAreaElement();
      const deskAreaRect = deskArea.getBoundingClientRect();
      const windowSpec = helpers.createInitialWIndowSpec(
        windowId,
        status,
        deskAreaRect,
      );
      windowSystem.add(windowId, windowSpec);
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
    const exists = store.state.wireConnectionKeys.includes(connectionKey);
    if (exists) {
      actionsInternal.removeWires([connectionKey]);
    } else {
      store.setWireConnectionKeys((prev) => [...prev, connectionKey]);
    }
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
    const unitId = unitIdHelper.getNextUnitId(
      store.state.unitItems,
      catalogKey,
    );
    const newUnit: BoardUnitItem = {
      type: "board",
      unitId,
      catalogKey,
      cardPosition: position,
    };
    store.setUnitItems((prev) => [...prev, newUnit]);
  },
  addNoteChannel() {
    const existingPorts = notePortGetters.filterNoteInputPortUnitItems(
      store.state.unitItems,
    );
    if (existingPorts.length >= 4) return;
    const newPort = helpers.createNoteChannelPort();
    store.setUnitItems((prev) => [...prev, newPort]);
    store.setCurrentNoteChannelId(newPort.unitId);
  },
  addAutomationEditorUnit() {
    const existingUnits = store.state.unitItems.filter(
      (it) => it.type === "automationEditor",
    );
    if (existingUnits.length >= 4) return;
    const newUnit = helpers.createAutomationEditorUnit();
    store.setUnitItems((prev) => [...prev, newUnit]);
  },
  removeCurrentNoteChannel() {
    const existingPorts = notePortGetters.filterNoteInputPortUnitItems(
      store.state.unitItems,
    );
    if (existingPorts.length <= 1) return;

    const currentId = store.state.currentNoteChannelId;
    const currentIndex = existingPorts.findIndex(
      (item) => item.unitId === currentId,
    );
    if (currentIndex < 0) return;

    actions.removeUnit(currentId);

    const remaining = existingPorts.filter((item) => item.unitId !== currentId);
    const nextPort =
      remaining[currentIndex] ?? remaining[currentIndex - 1] ?? remaining[0];
    store.setCurrentNoteChannelId(nextPort.unitId);
  },
  removeCurrentAutomationChannel() {
    const currentId = store.state.currentAutomationChannelId;
    if (!currentId) return;
    const currentItem = commonGetters.getUnitItemById(currentId);
    if (!currentItem) return;
    actions.removeUnit(currentId);
    const remaining = commonGetters.getAutomationEditorUnitItems();
    const first = remaining[0];
    if (first) {
      store.setCurrentAutomationChannelId(first.unitId);
      actionsInternal.patchUnitAttrs(first.unitId, {
        cardPosition: currentItem.cardPosition,
      });
    }
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
    actionsInternal.removeWires(wireConnectionKeys);
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
  selectNoteChannel(noteChannelId: string) {
    store.setCurrentNoteChannelId(noteChannelId);
  },
  selectAutomationChannel(automationChannelId: string) {
    store.setCurrentAutomationChannelId(automationChannelId);
  },
  setKeyName(keyName: KeyName) {
    store.setKeyName(keyName);
  },
  setWireGain(wireConnectionKey: string, value: number) {
    store.patchWireGains({ [wireConnectionKey]: value });
  },
};
