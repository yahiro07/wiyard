import { Point, Rect, Size } from "@lib/utils/common-types";
import { actionsInternal, storeSlice } from "./store";
import { WindowSpec } from "./types";
import { windowBoundsConverter } from "./window-placement-logic";

export type WindowCoordViewModel = {
  windowId: string;
  position: Point;
  contentSize: Size;
  setContentSize: (size: Size) => void;
  windowBounds: Rect;
  setWindowBounds: (bounds: Rect) => void;
  contentAspectRatioSpec: number | null;
};

const fallbackWindowSpec: WindowSpec = {
  position: { x: 0, y: 0 },
  contentSize: { width: 300, height: 200 },
  status: "none",
};

export function useWindowCoordViewModel(
  windowId: string,
): WindowCoordViewModel {
  const { windowSpecs } = storeSlice.useSnapshot();
  const windowSpec = windowSpecs[windowId] ?? fallbackWindowSpec;

  const windowBounds = windowBoundsConverter.fromWindowSpecCoords(windowSpec);

  return {
    windowId,
    position: windowSpec.position,
    contentSize: windowSpec.contentSize,
    setContentSize(contentSize: Size) {
      actionsInternal.patchWindowSpec(windowId, { contentSize });
    },
    windowBounds,
    setWindowBounds(bounds: Rect) {
      const { position, contentSize } =
        windowBoundsConverter.toWindowSpecCoords(bounds);
      actionsInternal.patchWindowSpec(windowId, {
        position,
        contentSize,
      });
    },
    contentAspectRatioSpec: windowSpec.freeRatio
      ? null
      : windowSpec.contentSize.width / windowSpec.contentSize.height,
  };
}
