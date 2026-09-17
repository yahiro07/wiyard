import { useEffect } from "react";
import { kKeyboardWindowId, kSequencerWindowId } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export function useProjectInitialStateFix() {
  const { projectLoadedIndex } = store.useSnapshot();
  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    const windowSpecs = store.state.windowSpecs;
    if (windowSpecs[kSequencerWindowId] === undefined) {
      actions.setWindowStatus(kSequencerWindowId, "minimized");
    }
    if (windowSpecs[kSequencerWindowId] === undefined) {
      actions.setWindowStatus(kKeyboardWindowId, "minimized");
    }
  }, [projectLoadedIndex]);
}
