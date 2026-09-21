import { actions, actionsInternal, storeSlice } from "./store";
import { WindowSystem, WindowSystemStoreSlice } from "./types";

export function createWindowSystem(args: {
  storeSlice: WindowSystemStoreSlice;
}): WindowSystem {
  Object.assign(storeSlice, args.storeSlice);
  return {
    add(id, spec) {
      actionsInternal.addWindowSpec(id, spec);
    },
    setStatus(id, status) {
      actionsInternal.patchWindowSpec(id, { status });
    },
    setCurrentWindow(id) {
      actions.setCurrentWindowId(id);
    },
    remove(id) {
      if (id === storeSlice.get().currentWindowId) {
        actions.setCurrentWindowId(null);
      }
      actions.removeWindow(id);
    },
    minimizeAll() {
      actions.minimizeAll();
    },
    unMinimizeAll() {
      actions.unMinimizeAll();
    },
    toggleMinimizeAll() {
      actions.toggleMinimizeAll();
    },
    has(id) {
      return !!storeSlice.get().windowSpecs[id];
    },
  };
}
