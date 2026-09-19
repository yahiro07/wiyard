import { useEffect } from "react";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { builtinAppItems } from "@/domain/builtin-app-entries";

export function useProjectInitialStateFix() {
  const { projectLoadedIndex } = store.useSnapshot();
  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    const windowSpecs = store.state.windowSpecs;

    for (const item of builtinAppItems) {
      const windowId = item.windowId;
      if (windowSpecs[windowId] === undefined) {
        actions.setWindowStatus(windowId, "minimized");
      }
    }
  }, [projectLoadedIndex]);
}
