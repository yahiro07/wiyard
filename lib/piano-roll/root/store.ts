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
  playPos: number | null;
  loopBars: LoopBarLength;
  pageIndex: number;
  inputNotes: Note[];
  previewNotePitch: number | null;
  stateLoadRevision: number;
  sight: Sight;
  patternNotes: Note[];
  isPatternView: boolean;
  patternBars: PatternBarLength;
  patternEnabled: boolean;
  mappedNotes: Note[] | null;
  realized: boolean;
  backupInputNotes: Note[] | null;
  diatonicLanesEnabled: boolean;
};

export type AppStore = Store<StoreState>;

const defaultStoreState: StoreState = {
  octave: 0,
  duty: 1,
  playPos: null,
  loopBars: 2,
  pageIndex: 0,
  inputNotes: [],
  previewNotePitch: null,
  stateLoadRevision: 0,
  sight: { xPosition: 0, yPosition: 0.5, xZoom: 0.5, yZoom: 0.5 },
  patternNotes: [],
  isPatternView: false,
  patternBars: 0.25,
  patternEnabled: false,
  mappedNotes: null,
  realized: false,
  backupInputNotes: null,
  diatonicLanesEnabled: false,
};
if (import.meta.env.DEV) {
  const base = 24;
  defaultStoreState.inputNotes = [
    { id: 0, position: 0, duration: 8, pitch: base + 0 },
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
}

export function createAppStore(): AppStore {
  return createStore<StoreState>(structuredClone(defaultStoreState));
}
