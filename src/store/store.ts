import { createStore, Store } from "snap-store";
import { UpdatePayload } from "vite";
import { Point } from "@/domain/common-types";
import { defaultScene, defaultWindowPosition } from "@/domain/default-data";
import { hostSystem } from "@/domain/host-system-instance";
import { PortStuff, UnitAddingItem, UnitItem, UnitStuff } from "@/domain/types";

type StoreState = {
  //will be persisted in project
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  sharedWindowPosition: Point;
  sequencerWindowPosition: Point;
  currentEffectUnitId: string | null;
  sequencerWindowVisible: boolean;
  currentNoteChannelId: string;
  windowsEvacuated: boolean;
  //not persisted
  unitStuffs: Record<string, UnitStuff>;
  portStuffs: Record<string, PortStuff>;
  draggingPortKey: string | null;
  previewDestPortKey: string | null;
  previewDestPosition: Point | null;
  unitPickerVisible: boolean;
  unitAddingItem: UnitAddingItem | null;
};

const blankStoreState: StoreState = {
  unitItems: [],
  wireConnectionKeys: [],
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowPosition: defaultWindowPosition,
  sequencerWindowVisible: false,
  currentEffectUnitId: null,
  currentNoteChannelId: "",
  //
  unitStuffs: {},
  portStuffs: {},
  windowsEvacuated: false,
  draggingPortKey: null,
  previewDestPortKey: null,
  previewDestPosition: null,
  unitPickerVisible: false,
  unitAddingItem: null,
};

const defaultStoreState: StoreState = {
  ...blankStoreState,
  unitItems: defaultScene.unitItems,
  wireConnectionKeys: defaultScene.wireConnectionKeys,
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowPosition: defaultWindowPosition,
  currentNoteChannelId: defaultScene.initialNoteChannelId,
};

if (1) {
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
