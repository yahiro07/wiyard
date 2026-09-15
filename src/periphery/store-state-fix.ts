import { useEffect } from "react";
import { kSequencerWindowId } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export function useProjectInitialStateFix() {
  const { projectLoadedIndex } = store.useSnapshot();
  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    if (store.state.windowSpecs[kSequencerWindowId] === undefined) {
      actions.setWindowStatus(kSequencerWindowId, "minimized");
    }
  }, [projectLoadedIndex]);
}
