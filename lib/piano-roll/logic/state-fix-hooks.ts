import { useEffect } from "react";
import { useAppContext } from "../root/app-context";

export function useFixStates() {
  const { store } = useAppContext();
  const { patternNotes, patternEnabled } = store.useSnapshot();

  /** biome-ignore lint/correctness/useExhaustiveDependencies: manual management */
  useEffect(() => {
    if (patternNotes.length === 0 && patternEnabled) {
      store.setPatternEnabled(false);
    }
  }, [patternNotes]);
}
