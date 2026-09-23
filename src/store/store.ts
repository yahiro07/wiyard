import { KeyName } from "@lib/contract";
import { pickObjectMembers, assignTyped } from "@lib/utils/array-object-helper";
import { Point, Size } from "@lib/utils/common-types";
import { createWindowSystem, WindowSpec } from "@lib/window-system";
import { createStore, Store } from "snap-store";
import { UpdatePayload } from "vite";
import { createFieldSightHandlers } from "@/components/field-sight-handlers";
import { FieldSight } from "@/components/field-sight-plane";
import { hostSystem } from "@/domain/host-system-instance";
import {
  PortStuff,
  UnitAddingItem,
  UnitItem,
  UnitStuff,
  WindowId,
} from "@/domain/types";
import { blankScene, defaultBoardSize } from "@/project/default-data";
import { ProjectLoadErrorStatus } from "@/store/store-types";
import { AppSettings, defaultAppSettings } from "@/common/app-settings";

export type StoreState = {
  //included in project data
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  wireGains: Record<string, number>; //0~1,center 0.5 for unity gain, store only edited values
  wireAutomationParameterIds: Record<string, string>;
  windowSpecs: Record<WindowId, WindowSpec>;
  currentWindowId: string | null;
  windowsEvacuated: boolean;
  currentNoteChannelId: string;
  currentAutomationChannelId: string | null;
  bpm: number;
  sight: FieldSight;
  keyName: KeyName;
  unitClockingFlags: Record<string, boolean>;
  boardSize: Size;
  //included in user's auto persistent data
  midiInEnabled: boolean;
  masterVolume: number;
  settings: AppSettings;
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
  projectLoadedIndex: number;
  projectLoading: boolean;
  secondBarVisible: boolean;
  autoPersistenceEnabled: boolean;
  importedProjectFileName: string | null;
  projectLoadErrorStatus: ProjectLoadErrorStatus | null;
  loadedFromSharedUrl: boolean;
  configTargetWireKey: string | null;
  soloPlaybackUnitId: string | null;
  soloModeUnitId: string | null;
  settingsPanelVisible: boolean;
};

const blankStoreState: StoreState = {
  unitItems: [],
  wireConnectionKeys: [],
  wireAutomationParameterIds: {},
  wireGains: {},
  windowSpecs: {},
  currentWindowId: null,
  windowsEvacuated: false,
  currentNoteChannelId: "",
  currentAutomationChannelId: null,
  bpm: 120,
  sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
  keyName: "C",
  unitClockingFlags: {},
  boardSize: defaultBoardSize,
  //
  midiInEnabled: false,
  masterVolume: 0.5,
  settings: defaultAppSettings,
  //
  unitStuffs: {},
  portStuffs: {},
  draggingPortKey: null,
  previewDestPortKey: null,
  previewDestPosition: null,
  unitPickerVisible: false,
  unitAddingItem: null,
  menuTargetUnitId: null,
  playing: false,
  projectLoadedIndex: 0,
  projectLoading: false,
  secondBarVisible: false,
  autoPersistenceEnabled: false,
  importedProjectFileName: null,
  projectLoadErrorStatus: null,
  loadedFromSharedUrl: false,
  configTargetWireKey: null,
  soloPlaybackUnitId: null,
  soloModeUnitId: null,
  settingsPanelVisible: false,
};

export const projectResetterStates: Partial<StoreState> = {
  unitItems: [],
  wireConnectionKeys: [],
  wireAutomationParameterIds: {},
  wireGains: {},
  windowSpecs: {},
  currentWindowId: null,
  windowsEvacuated: false,
  currentNoteChannelId: "",
  bpm: 120,
  sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
  keyName: "C",
  //
  unitStuffs: {},
  portStuffs: {},
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
  ...blankScene.storeStates,
};

if (1) {
  // store.setSequencerWindowVisible(true);
  assignTyped(defaultStoreState, {
    // ...blankScene.storeStates,
    // unitPickerVisible: true,
    // uiScaling: 0.9,
    secondBarVisible: true,
  });
}

export const store = ((window as any).store ??=
  createStore<StoreState>(defaultStoreState)) as Store<StoreState>;

const windowSliceKeys: (keyof StoreState)[] = [
  "windowSpecs",
  "currentWindowId",
  "windowsEvacuated",
];
export const windowSystem = createWindowSystem({
  storeSlice: {
    get: () => pickObjectMembers(store.state, windowSliceKeys),
    assign: (attrs) => store.assign(attrs),
    useSnapshot: () => pickObjectMembers(store.useSnapshot(), windowSliceKeys),
  },
});

export const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 2 },
);

if (import.meta.hot) {
  function applyStateEvacuationWorkaround() {
    const unitStates = hostSystem.getAllUnitStates();
    const backupState = { ...store.state };
    store.assign(blankStoreState);
    setTimeout(() => {
      void (async () => {
        console.log("restore unit states");
        store.setProjectLoading(true);
        store.assign({ ...backupState, unitStuffs: {}, portStuffs: {} });
        await hostSystem.waitUnitsLoaded();
        hostSystem.setAllUnitStates(unitStates);
        store.setProjectLoading(false);
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
