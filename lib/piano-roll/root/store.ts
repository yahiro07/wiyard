import { createStore } from "snap-store";
import { LoopBarLength, Note } from "../definitions/model";

export const store = createStore<{
  octave: number;
  duty: number;
  playPos: number | null;
  loopBars: LoopBarLength;
  pageIndex: number;
  notes: Note[];
  previewNotePitch: number | null;
  stateLoadRevision: number;
}>({
  octave: 0,
  duty: 1,
  playPos: null,
  loopBars: 2,
  pageIndex: 0,
  notes: [],
  previewNotePitch: null,
  stateLoadRevision: 0,
});

if (0) {
  //debug
  const base = 21;
  store.setNotes([
    { id: 0, position: 0, duration: 2, pitch: base + 14 },
    { id: 1, position: 2, duration: 2, pitch: base + 15 },
    { id: 2, position: 4, duration: 2, pitch: base + 16 },
    { id: 3, position: 6, duration: 2, pitch: base + 17 },
    { id: 4, position: 8, duration: 2, pitch: base + 17 },
    { id: 5, position: 16, duration: 8, pitch: base + 17 },
    { id: 6, position: 32, duration: 16, pitch: base + 14 },
  ]);
}
