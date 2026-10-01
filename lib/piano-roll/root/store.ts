import { createStore, Store } from "snap-store";
import { SongKeySpec } from "wafer-host/unit-types";
import {
  LoopBarLength,
  Note,
  PatternBarLength,
  Sight,
} from "../definitions/types";
import { appConfig, fallbackKeySpec } from "../definitions/ui-config";

type StoreState = {
  //persisted
  octaveShift: number;
  noteDuty: number;
  loopBars: LoopBarLength;
  inputNotes: Note[];
  patternBars: PatternBarLength;
  patternNotes: Note[];
  sight: Sight;
  patternEnabled: boolean;
  realized: boolean;
  backupInputNotes: Note[] | null;
  diatonicLanesEnabled: boolean;
  diatonicLanesAllowSemitoneInput: boolean;
  loopGhostEnabled: boolean;
  //volatile
  isPatternView: boolean;
  mappedNotes: Note[] | null;
  playPos: number | null;
  previewNotePitch: number | null;
  stateLoadRevision: number;
  keySpec: SongKeySpec;
  liveInputNoteNumbers: number[];
  viewActive: boolean;
  debugObject: object | null;
  sideControlsVisible: boolean;
};

export type AppStore = Store<StoreState>;

export const resetterStates = {
  isPatternView: false,
  mappedNotes: null,
  playPos: null,
  previewNotePitch: null,
} satisfies Partial<StoreState>;

const defaultStoreState: StoreState = {
  octaveShift: 0,
  noteDuty: 1,
  loopBars: 1,
  inputNotes: [],
  patternBars: 0.25,
  patternNotes: [],
  sight: {
    xBarPosition: 0,
    yPosition: 0.5,
    yZoom: 0.35,
    wBars: 4,
    withXPadding: false,
  },
  patternEnabled: false,
  realized: false,
  backupInputNotes: null,
  diatonicLanesEnabled: false,
  diatonicLanesAllowSemitoneInput: false,
  loopGhostEnabled: false,
  //
  isPatternView: false,
  mappedNotes: null,
  playPos: null,
  previewNotePitch: null,
  stateLoadRevision: 0,
  keySpec: fallbackKeySpec,
  liveInputNoteNumbers: [],
  viewActive: false,
  debugObject: null,
  sideControlsVisible: false,
};
if (appConfig.isDevelopment && 0) {
  const base = 24;
  defaultStoreState.inputNotes = [
    { id: 0, position: 0, duration: 2, pitch: base + 0 },
    { id: 1, position: 2, duration: 2, pitch: base + 2 },
    // { id: 2, position: 4, duration: 2, pitch: base + 4 },
    // { id: 3, position: 6, duration: 2, pitch: base + 5 },
    // { id: 4, position: 8, duration: 2, pitch: base + 7 },
    // { id: 5, position: 16, duration: 8, pitch: base + 9 },
    // { id: 6, position: 32, duration: 16, pitch: base + 12 },
  ];
  defaultStoreState.patternNotes = [
    { id: 0, position: 0, duration: 2, pitch: 7 },
    { id: 1, position: 2, duration: 2, pitch: 9 },
    { id: 2, position: 4, duration: 2, pitch: 11 },
  ];
  // defaultStoreState.isPatternView = true;
  // defaultStoreState.patternEnabled = true;
  defaultStoreState.loopBars = 1;
  defaultStoreState.loopGhostEnabled = true;

  defaultStoreState.diatonicLanesEnabled = true;
  const setKeySpec = (root: number, mode: "major" | "minor") => {
    const relativeKeyTranspose = root + (mode === "minor" ? 3 : 0);
    defaultStoreState.keySpec = { root, mode, relativeKeyTranspose };
  };
  setKeySpec(0, "major"); //C
}
if (appConfig.isDevelopment) {
  defaultStoreState.sideControlsVisible = true;
}

export function createAppStore(): AppStore {
  return createStore<StoreState>(structuredClone(defaultStoreState));
}
