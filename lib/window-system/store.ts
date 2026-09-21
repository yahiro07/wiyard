import { WindowSpec, WindowStatus, WindowSystemStoreSlice } from "./types";
import { mapObjectValues } from "@lib/utils/array-object-helper";

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
  mapWindowStatusAll(fn: (status: WindowStatus) => WindowStatus) {
    const newWindowSpecs = mapObjectValues(
      storeSlice.get().windowSpecs,
      (spec) => ({ ...spec, status: fn(spec.status) }) as WindowSpec,
    );
    storeSlice.assign({ windowSpecs: newWindowSpecs });
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
  minimizeAll() {
    actionsInternal.mapWindowStatusAll((status) =>
      status === "visible" ? "minimized" : status,
    );
  },
  unMinimizeAll() {
    actionsInternal.mapWindowStatusAll((status) =>
      status === "minimized" ? "visible" : status,
    );
  },
  toggleMinimizeAll() {
    const someVisible = Object.values(storeSlice.get().windowSpecs).some(
      (spec) => spec.status === "visible",
    );
    if (someVisible) {
      actions.minimizeAll();
    } else {
      actions.unMinimizeAll();
    }
  },
  closeAll() {
    actionsInternal.mapWindowStatusAll(() => "none");
  },
};
