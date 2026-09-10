import { createStore, Store } from "snap-store";
import { LoopBarLength, Note } from "../definitions/types";

type StoreState = {
  octave: number;
  duty: number;
  playPos: number | null;
  loopBars: LoopBarLength;
  pageIndex: number;
  notes: Note[];
  previewNotePitch: number | null;
  stateLoadRevision: number;
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
};
if (import.meta.env.DEV) {
  const base = 21;
  defaultStoreState.notes = [
    { id: 0, position: 0, duration: 2, pitch: base + 14 },
    { id: 1, position: 2, duration: 2, pitch: base + 15 },
    { id: 2, position: 4, duration: 2, pitch: base + 16 },
    { id: 3, position: 6, duration: 2, pitch: base + 17 },
    { id: 4, position: 8, duration: 2, pitch: base + 17 },
    { id: 5, position: 16, duration: 8, pitch: base + 17 },
    { id: 6, position: 32, duration: 16, pitch: base + 14 },
  ];
}

export function createAppStore(): AppStore {
  return createStore<StoreState>(structuredClone(defaultStoreState));
}
