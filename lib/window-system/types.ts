import { Point, Size } from "@lib/utils/common-types";

export type WindowStatus = "visible" | "minimized" | "none";

export type WindowSpec = {
  position: Point; //center of the content plane, from top left corner of the desk area
  contentSize: Size; //size of content, excluding title bar
  status: WindowStatus;
  freeRatio?: boolean;
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
