import { KeyName } from "@lib/contract";
import {
  setOrDeleteValue,
  stripUndefined,
} from "@lib/utils/array-object-helper";
import { Point, Size } from "@lib/utils/common-types";
import { sizeOp } from "@lib/utils/geometry-helper";
import { WindowSpec, WindowStatus } from "@lib/window-system";
import { appConfig } from "@/common/app-config";
import { builtinAppItems } from "@/domain/builtin-app-entries";
import {
  decodeWireConnectionKey,
  filterUnitRelatedWires,
  getForwardDirectionWireConnectionKey,
} from "@/domain/port-helpers";
import {
  AutomationEditorUnitItem,
  BoardUnitItem,
  ControlSurfaceUnitItem,
  NoteInputPortUnitItem,
  PortStuff,
  UnitAddingItem,
  UnitControlEffectItem,
  UnitStuff,
  windowIds,
} from "@/domain/types";
import { CatalogKey } from "@/domain/unit-entries";
import { unitIdHelper } from "@/domain/unit-id-helper";
import { cardPlacementHelper } from "@/store/card-placement-helper";
import { commonGetters } from "@/store/common-getters";
import { controlEffectUnitGetters } from "@/store/control-effect-unit-getters";
import { notePortGetters } from "@/store/note-port-getters";
import { store, windowSystem } from "@/store/store";

const helpers = {
  getGeneralUnitInitialSize(windowId: string) {
    const viewSize = store.state.unitStuffs[windowId]?.viewSize;
    if (viewSize) {
      const maxHeight = 220;
      const maxWidth = 440;
      let scale = 1;
      if (viewSize.height > maxHeight) {
        scale = maxHeight / viewSize.height;
      }
      if (viewSize.width * scale > maxWidth) {
        scale = maxWidth / viewSize.width;
      }
      return sizeOp.rounded({
        width: viewSize.width * scale,
        height: viewSize.height * scale,
      });
    } else {
      return { width: 300, height: 200 };
    }
  },
  getInitialWindowSpecAttrs(windowId: string): {
    contentSize: Size;
    pinned?: boolean;
    freeRatio?: boolean;
  } {
    const appItem = builtinAppItems.find((item) => item.windowId === windowId);
    if (appItem) {
      return {
        contentSize: appItem.windowInitialSize,
        freeRatio: appItem.windowFreeRatio,
        pinned: true,
      };
    } else {
      return { contentSize: helpers.getGeneralUnitInitialSize(windowId) };
    }
  },
  createInitialWindowSpec(windowId: string, status: WindowStatus) {
    const position = { x: 0, y: 0 };
    const { contentSize, freeRatio, pinned } =
      helpers.getInitialWindowSpecAttrs(windowId);
    // position.y = bottomLimit(position.y, contentSize.height / 2 + 34);
    const newWindowSpec: WindowSpec = {
      position,
      contentSize,
      status,
      ...stripUndefined({ freeRatio, pinned }),
    };
    return newWindowSpec;
  },
  _getNextPortCardPosition() {
    const items = store.state.unitItems.filter(
      (it) =>
        it.type === "noteInput" ||
        it.type === "automationEditor" ||
        it.type === "controlSurface",
    );
    const lastItem = items.at(-1);
    if (lastItem) {
      const newPosition = {
        x: lastItem.cardPosition.x,
        y: lastItem.cardPosition.y + 100,
      };
      return cardPlacementHelper.clampCardPositionInGraphPlane(
        newPosition,
        true,
      );
    }
    return { x: 0, y: 0 };
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
  createControlSurfaceUnit(): ControlSurfaceUnitItem {
    return {
      type: "controlSurface",
      unitId: "controlSurface",
      cardPosition: helpers._getNextPortCardPosition(),
    };
  },
};

const removeRecordKeys = (dict: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    delete dict[key];
  }
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
    store.produceWireGains((draft) =>
      removeRecordKeys(draft, wireConnectionKeys),
    );
    store.produceWireAutomationParameterIds((draft) =>
      removeRecordKeys(draft, wireConnectionKeys),
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
      const windowSpec = helpers.createInitialWindowSpec(windowId, status);
      windowSystem.add(windowId, windowSpec);
      windowSystem.setCurrentWindow(windowId);

      if (windowId === windowIds.controlSurface) {
        const csUnitItem = commonGetters.getControlSurfaceUnitItem();
        if (!csUnitItem) {
          const newUnit = helpers.createControlSurfaceUnit();
          store.setUnitItems((prev) => [...prev, newUnit]);
        }
      }
    }
    windowSystem.setStatus(windowId, status);
  },
  setWindowContentSize(windowId: string, newSize: Size) {
    store.patchWindowSpecs((prev) => ({
      [windowId]: {
        ...prev[windowId],
        contentSize: newSize,
      },
    }));
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
  toggleWire(
    sourcePortKey: string,
    destPortKey: string,
    connectingByDrag?: boolean,
  ) {
    const connectionKey = getForwardDirectionWireConnectionKey(
      sourcePortKey,
      destPortKey,
    );
    const exists = store.state.wireConnectionKeys.includes(connectionKey);
    if (exists) {
      actionsInternal.removeWires([connectionKey]);
    } else {
      store.setWireConnectionKeys((prev) => [...prev, connectionKey]);

      if (
        connectingByDrag &&
        appConfig.showAutomationTargetParameterSelectionMenuOnConnection
      ) {
        const { sourcePortKey } = decodeWireConnectionKey(connectionKey);
        const portStuff = store.state.portStuffs[sourcePortKey];
        if (portStuff.subtype === "automation") {
          store.setConfigTargetWireKey(connectionKey);
        }
      }
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
    const isControlEffectEnabled =
      controlEffectUnitGetters.isUnitControlEffectDefaultEnabled(catalogKey);
    if (isControlEffectEnabled) {
      store.patchUnitControlEffects({ [unitId]: { volume: 0.5, pan: 0.5 } });
    }
  },
  addNoteChannel() {
    const existingPorts = notePortGetters.filterNoteInputPortUnitItems(
      store.state.unitItems,
    );
    if (existingPorts.length >= appConfig.maxNoteChannels) return;
    const newPort = helpers.createNoteChannelPort();
    store.setUnitItems((prev) => [...prev, newPort]);
    store.setCurrentNoteChannelId(newPort.unitId);
  },
  addAutomationEditorUnit() {
    const existingUnits = store.state.unitItems.filter(
      (it) => it.type === "automationEditor",
    );
    if (existingUnits.length >= appConfig.maxAutomationChannels) return;
    const newUnit = helpers.createAutomationEditorUnit();
    store.setUnitItems((prev) => [...prev, newUnit]);
    store.setCurrentAutomationChannelId(newUnit.unitId);
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
    const targetId = store.state.currentAutomationChannelId;
    if (!targetId) return;
    const items = commonGetters.getAutomationEditorUnitItems();
    const targetItem = commonGetters.getUnitItemById(targetId);
    if (!targetItem) return;
    actions.removeUnit(targetId);
    const isAlteringFirstItem = targetItem === items[0];

    const remaining = items.filter((it) => it.unitId !== targetId);
    const nextFirstItem = remaining[0];
    if (nextFirstItem) {
      store.setCurrentAutomationChannelId(nextFirstItem.unitId);
      if (isAlteringFirstItem) {
        actionsInternal.patchUnitAttrs(nextFirstItem.unitId, {
          cardPosition: targetItem.cardPosition,
        });
      }
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
    store.produceUnitControlEffects((draft) => delete draft[unitId]);
    windowSystem.remove(unitId);
  },
  toggleMidiInEnabled() {
    store.toggleMidiInEnabled();
  },
  togglePlayback() {
    // if (!store.state.playing && store.state.soloPlaybackUnitId) {
    //   store.setSoloPlaybackUnitId(null);
    // }
    store.togglePlaying();
  },
  toggleSoloPlayback(unitId: string) {
    // if (unitId && store.state.playing) {
    //   store.setPlaying(false);
    // }
    store.setSoloPlaybackUnitId((prev) => (prev === unitId ? null : unitId));
  },
  toggleSoloModeUnit(unitId: string) {
    store.setSoloModeUnitId((prev) => (prev === unitId ? null : unitId));
  },
  selectNoteChannel(nextNoteChannelId: string) {
    const sequencerUnitId = notePortGetters.getSequencerUnitId(
      store.state.currentNoteChannelId,
    );
    store.setCurrentNoteChannelId(nextNoteChannelId);

    if (store.state.soloPlaybackUnitId === sequencerUnitId) {
      store.setSoloPlaybackUnitId(null);
    }
    if (store.state.soloModeUnitId === sequencerUnitId) {
      const nextSequencerUnitId =
        notePortGetters.getSequencerUnitId(nextNoteChannelId);
      store.setSoloModeUnitId(nextSequencerUnitId);
    }
  },
  toggleUnitClockingFlag(unitId: string) {
    store.produceUnitClockingFlags((draft) => {
      if (draft[unitId] === undefined) {
        draft[unitId] = false;
      } else {
        draft[unitId] = !draft[unitId];
      }
    });
  },
  selectAutomationChannel(automationChannelId: string) {
    store.setCurrentAutomationChannelId(automationChannelId);
  },
  setKeyName(keyName: KeyName) {
    store.setKeyName(keyName);
  },
  setWireGain(wireConnectionKey: string, value: number | null) {
    store.produceWireGains((draft) => {
      setOrDeleteValue(draft, wireConnectionKey, value);
    });
  },
  toggleUnitControlEffect(unitId: string) {
    store.produceUnitControlEffects((draft) => {
      if (draft[unitId] === undefined) {
        draft[unitId] = { volume: 0.5, pan: 0.5 };
      } else {
        delete draft[unitId];
      }
    });
  },
  setUnitControlEffectValue<K extends keyof UnitControlEffectItem>(
    unitId: string,
    key: K,
    value: UnitControlEffectItem[K],
  ) {
    store.patchUnitControlEffects((prev) => ({
      [unitId]: { ...prev[unitId], [key]: value },
    }));
  },
  setGraphAreaElevated(elevated: boolean) {
    store.setGraphAreaElevated(elevated);
  },
  toggleGraphAreaElevated() {
    store.toggleGraphAreaElevated();
  },
};
