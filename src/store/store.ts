import { createStore, Store } from "snap-store";
import { UpdatePayload } from "vite";
import { Point, Size } from "@/domain/common-types";
import { defaultScene, defaultWindowPosition } from "@/domain/default-data";
import { hostSystem } from "@/domain/host-system-instance";
import {
  OffStageUnitItem,
  PortStuff,
  UnitAddingItem,
  UnitItem,
  UnitStuff,
  WindowStatus,
} from "@/domain/types";

type StoreState = {
  //will be persisted in project
  unitItems: UnitItem[];
  offStageUnitItems: OffStageUnitItem[];
  wireConnectionKeys: string[];
  sequencerWindowPosition: Point;
  sequencerWindowSize: Size;
  currentWindowUnitId: string | null;
  sequencerWindowStatus: WindowStatus;
  currentNoteChannelId: string;
  windowsEvacuated: boolean;
  midiInEnabled: boolean;
  bpm: number;
  masterVolume: number;
  //not persisted
  unitStuffs: Record<string, UnitStuff>;
  portStuffs: Record<string, PortStuff>;
  draggingPortKey: string | null;
  previewDestPortKey: string | null;
  previewDestPosition: Point | null;
  unitPickerVisible: boolean;
  unitAddingItem: UnitAddingItem | null;
  menuTargetUnitId: string | null;
  playing: boolean;
};

const blankStoreState: StoreState = {
  unitItems: [],
  offStageUnitItems: [],
  wireConnectionKeys: [],
  sequencerWindowPosition: defaultWindowPosition,
  sequencerWindowSize: { width: 380 + 190, height: 300 },
  sequencerWindowStatus: "none",
  currentWindowUnitId: null,
  currentNoteChannelId: "",
  midiInEnabled: false,
  bpm: 120,
  masterVolume: 0.5,
  //
  unitStuffs: {},
  portStuffs: {},
  windowsEvacuated: false,
  draggingPortKey: null,
  previewDestPortKey: null,
  previewDestPosition: null,
  unitPickerVisible: false,
  unitAddingItem: null,
  menuTargetUnitId: null,
  playing: false,
};

const defaultStoreState: StoreState = {
  ...blankStoreState,
  unitItems: defaultScene.unitItems,
  offStageUnitItems: defaultScene.offstageUnitItems,
  wireConnectionKeys: defaultScene.wireConnectionKeys,
  sequencerWindowPosition: defaultWindowPosition,
  currentNoteChannelId: defaultScene.initialNoteChannelId,
};

if (0) {
  // store.setSequencerWindowVisible(true);
  Object.assign(defaultStoreState, {
    unitPickerVisible: true,
  });
}

export const store = ((window as any).store ??=
  createStore<StoreState>(defaultStoreState)) as Store<StoreState>;

if (import.meta.hot) {
  function applyStateEvacuationWorkaround() {
    const unitStates = hostSystem.getAllUnitStates();
    const backupState = { ...store.state };
    store.assign(blankStoreState);
    setTimeout(() => {
      void (async () => {
        console.log("restore unit states");
        store.assign({ ...backupState, unitStuffs: {}, portStuffs: {} });
        await hostSystem.waitUnitsLoaded();
        hostSystem.setAllUnitStates(unitStates);
      })();
    }, 100);
  }
  let timerId: NodeJS.Timeout | null;
  function wrapApplyStateEvacuationWorkaround() {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(applyStateEvacuationWorkaround, 100);
  }

  const hmr = import.meta.hot;
  if (hmr.data.initialized) {
    // applyStateEvacuationWorkaround();
  }
  hmr.data.initialized = true;

  function loagHmrTargets(payload: UpdatePayload) {
    console.log(
      `HMR occurred for:\n${payload.updates.map((it) => it.path).join("\n")}`,
    );
    wrapApplyStateEvacuationWorkaround();
  }
  hmr.on("vite:afterUpdate", loagHmrTargets);
  hmr.dispose(() => {
    hmr.off("vite:afterUpdate", loagHmrTargets);
  });
}
