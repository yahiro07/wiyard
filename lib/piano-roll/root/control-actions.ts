import { useState } from "react";
import { useAppContext } from "./app-context";
import { AppStore } from "./store";
import { Note, LoopBarLength } from "../definitions/types";

function overlapsRange(note: Note, start: number, end: number): boolean {
  return note.position < end && note.position + note.duration > start;
}
function nextNoteId(notes: Note[]): number {
  return notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 0;
}

function createControlActions(store: AppStore) {
  return {
    clearEditData() {
      store.assign({
        inputNotes: [],
        patternNotes: [],
        patternEnabled: false,
        realized: false,
      });
    },
    realizeNotes() {
      const st = store.state;
      if (!st.mappedNotes) return;
      store.assign({
        backupInputNotes: st.inputNotes,
        inputNotes: st.mappedNotes.map((note, i) => ({
          id: i,
          pitch: note.pitch,
          position: note.position,
          duration: note.duration,
        })),
        patternEnabled: false,
        realized: true,
      });
    },
    undoRealize() {
      const st = store.state;
      if (!st.backupInputNotes) return;
      store.assign({
        inputNotes: st.backupInputNotes,
        backupInputNotes: null,
        patternEnabled: true,
        realized: false,
      });
    },
    duplicateNotes2X() {
      const st = store.state;
      const { loopBars, inputNotes, realized } = st;
      if (realized) return;
      if (loopBars >= 16 || inputNotes.length === 0) return;
      const loopSteps = loopBars * 16;
      const destStart = loopSteps;
      const destEnd = loopSteps * 2;
      const sourceNotes = inputNotes.filter((n) => n.position < destStart);
      const keptNotes = inputNotes.filter(
        (n) => !overlapsRange(n, destStart, destEnd),
      );
      let nextId = nextNoteId(keptNotes);
      const copies = sourceNotes.map((note) => ({
        id: nextId++,
        pitch: note.pitch,
        position: note.position + destStart,
        duration: note.duration,
      }));
      store.assign({
        inputNotes: [...keptNotes, ...copies],
        loopBars: (loopBars * 2) as LoopBarLength,
      });
    },
  };
}

export function useControlActions() {
  const { store } = useAppContext();
  const [actions] = useState(() => createControlActions(store));
  return actions;
}
