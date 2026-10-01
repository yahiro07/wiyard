import { usePrevious } from "@lib/utils/hooks";
import { useEffect } from "react";
import { useAppContext } from "../model/app-context";

export function useFixStates() {
  const { store } = useAppContext();
  const { patternNotes, patternEnabled, isPatternView } = store.useSnapshot();

  const prevIsPatternView = usePrevious(isPatternView);
  /** biome-ignore lint/correctness/useExhaustiveDependencies: manual management */
  useEffect(() => {
    if (
      prevIsPatternView &&
      !isPatternView &&
      patternNotes.length === 0 &&
      patternEnabled
    ) {
      store.setPatternEnabled(false);
    }
  }, [isPatternView]);
}
