import { createStore, Store } from "snap-store";
import { defaultScene, defaultWindowPosition } from "@/domain/default-data";
import { PortStuff, UnitItem, UnitStuff } from "@/domain/types";
import { Point } from "@/utils/drag-session";

type StoreState = {
  //will be persisted
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  sharedWindowPosition: Point;
  sequencerWindowPosition: Point;
  currentEffectUnitId: string | null;
  sequencerWindowVisible: boolean;
  currentNoteChannelId: string;
  //not persisted
  unitStuffs: Record<string, UnitStuff>;
  portStuffs: Record<string, PortStuff>;
  windowsEvacuated: boolean;
};

const defaultStoreState: StoreState = {
  unitItems: defaultScene.unitItems,
  wireConnectionKeys: defaultScene.wireConnectionKeys,
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowPosition: defaultWindowPosition,
  sequencerWindowVisible: false,
  currentEffectUnitId: null,
  currentNoteChannelId: defaultScene.initialNoteChannelId,
  //
  unitStuffs: {},
  portStuffs: {},
  windowsEvacuated: false,
};

const blankStoreState: StoreState = {
  unitItems: [],
  wireConnectionKeys: [],
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowPosition: defaultWindowPosition,
  sequencerWindowVisible: false,
  currentEffectUnitId: null,
  currentNoteChannelId: "",
  unitStuffs: {},
  portStuffs: {},
  windowsEvacuated: false,
};

export const store = ((window as any).store ??=
  createStore<StoreState>(defaultStoreState)) as Store<StoreState>;

if (0) {
  store.setSequencerWindowVisible(true);
}

if (import.meta.hot) {
  function applyStateEvacuationWorkaround() {
    const backupState = structuredClone(store.state);
    store.assign(blankStoreState);
    setTimeout(() => {
      store.assign(backupState);
    }, 100);
  }
  const hmr = import.meta.hot;
  if (hmr.data.initialized) {
    applyStateEvacuationWorkaround();
  }
  hmr.data.initialized = true;

  hmr.on("vite:afterUpdate", (payload) => {
    console.log(
      `HMR occurred for:\n${payload.updates.map((it) => it.path).join("\n")}`,
    );
  });
}
