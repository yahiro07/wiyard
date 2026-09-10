import { createStore, Store } from "snap-store";
import {
  LoopBarLength,
  Note,
  PatternLoopBarLength,
  Sight,
} from "../definitions/types";

type StoreState = {
  octave: number;
  duty: number;
  playPos: number | null;
  loopBars: LoopBarLength;
  pageIndex: number;
  notes: Note[];
  previewNotePitch: number | null;
  stateLoadRevision: number;
  sight: Sight;
  patternNotes: Note[];
  isPatternView: boolean;
  patternLoopBars: PatternLoopBarLength;
};

export type AppStore = Store<StoreState>;

const defaultStoreState: StoreState = {
  octave: 0,
  duty: 1,
  playPos: null,
  loopBars: 2,
  pageIndex: 0,
  notes: [],
  previewNotePitch: null,
  stateLoadRevision: 0,
  sight: { xPosition: 0, yPosition: 0.5, xZoom: 0.5, yZoom: 0.5 },
  patternNotes: [],
  isPatternView: false,
  patternLoopBars: 0.25,
};
if (import.meta.env.DEV) {
  const base = 24;
  defaultStoreState.notes = [
    { id: 0, position: 0, duration: 2, pitch: base + 0 },
    { id: 1, position: 2, duration: 2, pitch: base + 2 },
    { id: 2, position: 4, duration: 2, pitch: base + 4 },
    { id: 3, position: 6, duration: 2, pitch: base + 5 },
    { id: 4, position: 8, duration: 2, pitch: base + 7 },
    { id: 5, position: 16, duration: 8, pitch: base + 9 },
    { id: 6, position: 32, duration: 16, pitch: base + 12 },
  ];
  defaultStoreState.isPatternView = true;
}

export function createAppStore(): AppStore {
  return createStore<StoreState>(structuredClone(defaultStoreState));
}
