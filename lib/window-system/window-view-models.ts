import { actionsInternal, storeSlice } from "./store";
import { WindowSpec } from "./types";
import { Point, Size } from "./utils/common-types";

export type WindowCoordViewModel = {
  windowId: string;
  position: Point;
  setPosition: (position: Point) => void;
  size: Size;
  setSize: (size: Size) => void;
};

const fallbackPosition = { x: 0, y: 0 };
const fallbackSize = { width: 300, height: 200 };

export function useWindowCoordViewModel(
  windowId: string,
): WindowCoordViewModel {
  const { windowSpecs } = storeSlice.useSnapshot();
  const windowSpec = windowSpecs[windowId] as WindowSpec | undefined;

  return {
    windowId,
    position: windowSpec?.position ?? fallbackPosition,
    setPosition: (position: Point) => {
      actionsInternal.patchWindowSpec(windowId, { position });
    },
    size: windowSpec?.size ?? fallbackSize,
    setSize: (size: Size) => {
      actionsInternal.patchWindowSpec(windowId, { size });
    },
  };
}
