import { createStore, Store } from "snap-store";
import {
  LoopBarLength,
  Note,
  PatternBarLength,
  Sight,
} from "../definitions/types";

type StoreState = {
  octave: number;
  duty: number;
  loopBars: LoopBarLength;
  inputNotes: Note[];
  patternBars: PatternBarLength;
  patternNotes: Note[];
  sight: Sight;
  isPatternView: boolean;
  patternEnabled: boolean;
  realized: boolean;
  backupInputNotes: Note[] | null;
  diatonicLanesEnabled: boolean;
  diatonicLanesAllowSemitoneInput: boolean;
  loopGhostEnabled: boolean;
  //
  mappedNotes: Note[] | null;
  playPos: number | null;
  // pageIndex: number;
  previewNotePitch: number | null;
  stateLoadRevision: number;
};

export type AppStore = Store<StoreState>;

const defaultStoreState: StoreState = {
  octave: 0,
  duty: 1,
  loopBars: 2,
  inputNotes: [],
  patternBars: 0.25,
  patternNotes: [],
  sight: { xPosition: 0, yPosition: 0.5, xZoom: 0.45, yZoom: 0.6 },
  isPatternView: false,
  patternEnabled: false,
  realized: false,
  backupInputNotes: null,
  diatonicLanesEnabled: false,
  diatonicLanesAllowSemitoneInput: false,
  loopGhostEnabled: false,
  //
  mappedNotes: null,
  playPos: null,
  // pageIndex: 0,
  previewNotePitch: null,
  stateLoadRevision: 0,
};
if (import.meta.env.DEV && 1) {
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
}

export function createAppStore(): AppStore {
  return createStore<StoreState>(structuredClone(defaultStoreState));
}
