import { useEffect } from "react";
import { windowIds } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export function useProjectInitialStateFix() {
  const { projectLoadedIndex } = store.useSnapshot();
  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    const windowSpecs = store.state.windowSpecs;
    const sequencerWindowId = windowIds.sequencer;
    const keyboardWindowId = windowIds.keyboard;
    const automationEditorWindowId = windowIds.automationEditor;

    if (windowSpecs[sequencerWindowId] === undefined) {
      actions.setWindowStatus(sequencerWindowId, "minimized");
    }
    if (windowSpecs[keyboardWindowId] === undefined) {
      actions.setWindowStatus(keyboardWindowId, "minimized");
    }
    if (windowSpecs[automationEditorWindowId] === undefined) {
      actions.setWindowStatus(automationEditorWindowId, "minimized");
    }
  }, [projectLoadedIndex]);
}
