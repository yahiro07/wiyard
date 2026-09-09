import { WindowSpec, WindowStatus, WindowSystemStoreSlice } from "./types";

export const storeSlice: WindowSystemStoreSlice = {} as any;

export const actionsInternal = {
  addWindowSpec(id: string, spec: WindowSpec) {
    storeSlice.assign({
      windowSpecs: {
        ...storeSlice.get().windowSpecs,
        [id]: spec,
      },
    });
  },
  patchWindowSpec(
    id: string,
    specifier:
      | Partial<WindowSpec>
      | ((prev: WindowSpec) => Partial<WindowSpec>),
  ) {
    const windowSpecs = storeSlice.get().windowSpecs;
    const windowSpec = windowSpecs[id];
    if (!windowSpec) return;
    const attrs =
      typeof specifier === "function" ? specifier(windowSpec) : specifier;
    storeSlice.assign({
      windowSpecs: {
        ...windowSpecs,
        [id]: { ...windowSpec, ...attrs },
      },
    });
  },
};

export const actions = {
  setWindowStatus(windowId: string, status: WindowStatus) {
    actionsInternal.patchWindowSpec(windowId, { status });
  },
  toggleWindowMinimized(windowId: string) {
    actionsInternal.patchWindowSpec(windowId, (prev) => ({
      status: prev.status === "visible" ? "minimized" : "visible",
    }));
  },
  removeWindow(id: string) {
    const windowSpecs = { ...storeSlice.get().windowSpecs };
    delete windowSpecs[id];
    storeSlice.assign({ windowSpecs });
  },
  setCurrentWindowId(windowId: string | null) {
    storeSlice.assign({ currentWindowId: windowId });
  },
  toggleWindowsEvacuated() {
    const curr = storeSlice.get().windowsEvacuated;
    storeSlice.assign({ windowsEvacuated: !curr });
  },
  setWindowsEvacuated(evacuated: boolean) {
    storeSlice.assign({ windowsEvacuated: evacuated });
  },
};
