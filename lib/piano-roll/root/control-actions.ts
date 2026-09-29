import { useState } from "react";
import { LoopBarLength, Note } from "../definitions/types";
import { useAppContext } from "./app-context";
import { AppStore } from "./store";
import {
  getLoopBarLengthForBarPosition,
  getNotesTailPositionInBars,
} from "../editor/common/editor-common-logic";

function nextNoteId(notes: Note[]): number {
  return notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 0;
}

function createControlActions(store: AppStore) {
  return {
    clearEditData() {
      store.assign({
        inputNotes: [],
        // patternNotes: [],
        // patternEnabled: false,
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
    duplicateInputNotes2X() {
      const { inputNotes, loopBars } = store.state;
      if (inputNotes.length === 0) return;
      const tailPos = getNotesTailPositionInBars(inputNotes);
      const sourceBars = Math.min(
        getLoopBarLengthForBarPosition(tailPos),
        loopBars,
      );
      if (sourceBars > 8) return;
      const destStart = sourceBars * 16;
      const sourceNotes = inputNotes.filter((n) => n.position < destStart);
      let nextId = nextNoteId(sourceNotes);
      const copies = sourceNotes.map((note) => ({
        id: nextId++,
        pitch: note.pitch,
        position: note.position + destStart,
        duration: note.duration,
      }));
      store.setInputNotes([...sourceNotes, ...copies]);
      if (sourceBars * 2 > store.state.loopBars) {
        store.setLoopBars((sourceBars * 2) as LoopBarLength);
      }
    },
    duplicatePatternNotes2X() {
      const { patternNotes } = store.state;
      if (patternNotes.length === 0) return;
      const tailPos = getNotesTailPositionInBars(patternNotes);
      const sourceBars = getLoopBarLengthForBarPosition(tailPos);
      if (sourceBars > 1) return;
      const destStart = sourceBars * 16;
      const sourceNotes = patternNotes.filter((n) => n.position < destStart);
      let nextId = nextNoteId(sourceNotes);
      const copies = sourceNotes.map((note) => ({
        id: nextId++,
        pitch: note.pitch,
        position: note.position + destStart,
        duration: note.duration,
      }));
      store.setPatternNotes([...sourceNotes, ...copies]);
    },
    clearPatternNotes() {
      store.assign({ patternNotes: [] });
    },
  };
}

export function useControlActions() {
  const { store } = useAppContext();
  const [actions] = useState(() => createControlActions(store));
  return actions;
}
