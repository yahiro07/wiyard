import { useState } from "react";
import { useAppContext } from "./app-context";
import { AppStore } from "./store";

function createControlActions(store: AppStore) {
  return {
    clearNotes() {
      store.assign({
        inputNotes: [],
        patternNotes: [],
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
  };
}

export function useControlActions() {
  const { store } = useAppContext();
  const [actions] = useState(() => createControlActions(store));
  return actions;
}
