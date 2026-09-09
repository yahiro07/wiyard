import { Point, Size } from "../utils/common-types";

export type WindowStatus = "visible" | "minimized" | "none";

export type WindowSpec = {
  position: Point;
  status: WindowStatus;
  size: Size;
};

export type WindowSystem = {
  add(id: string, spec: WindowSpec): void;
  setStatus(id: string, status: WindowStatus): void;
  setCurrentWindow(id: string): void;
  remove(id: string): void;
  setEvacuate(evacuated: boolean): void;
  toggleEvacuate(): void;
  has(id: string): boolean;
};

export type WindowSliceState = {
  windowSpecs: Record<string, WindowSpec>;
  currentWindowId: string | null;
  windowsEvacuated: boolean;
};

export type WindowSystemStoreSlice = {
  get: () => WindowSliceState;
  assign: (partial: Partial<WindowSliceState>) => void;
  useSnapshot: () => WindowSliceState;
};
