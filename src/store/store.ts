import { createStore, Store } from "snap-store";
import { UpdatePayload } from "vite";
import { Point } from "@/domain/common-types";
import { defaultScene, defaultWindowPosition } from "@/domain/default-data";
import { hostSystem } from "@/domain/host-system-instance";
import { PortStuff, UnitItem, UnitStuff } from "@/domain/types";

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
};

const defaultStoreState: StoreState = {
  ...blankStoreState,
  unitItems: defaultScene.unitItems,
  wireConnectionKeys: defaultScene.wireConnectionKeys,
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowPosition: defaultWindowPosition,
  currentNoteChannelId: defaultScene.initialNoteChannelId,
};

export const store = ((window as any).store ??=
  createStore<StoreState>(defaultStoreState)) as Store<StoreState>;

if (0) {
  store.setSequencerWindowVisible(true);
}

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
  const hmr = import.meta.hot;
  if (hmr.data.initialized) {
    applyStateEvacuationWorkaround();
  }
  hmr.data.initialized = true;

  function loagHmrTargets(payload: UpdatePayload) {
    console.log(
      `HMR occurred for:\n${payload.updates.map((it) => it.path).join("\n")}`,
    );
  }
  hmr.on("vite:afterUpdate", loagHmrTargets);
  hmr.dispose(() => {
    hmr.off("vite:afterUpdate", loagHmrTargets);
  });
}
