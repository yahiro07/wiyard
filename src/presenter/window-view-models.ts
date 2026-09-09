import { Point, Size } from "@/domain/common-types";
import { WindowId, WindowSpec } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

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
  windowId: WindowId,
): WindowCoordViewModel {
  const { windowSpecs } = store.useSnapshot();
  const windowSpec = windowSpecs[windowId] as WindowSpec | undefined;

  return {
    windowId,
    position: windowSpec?.position ?? fallbackPosition,
    setPosition: (position: Point) => {
      actions.patchWindowSpec(windowId, { position });
    },
    size: windowSpec?.size ?? fallbackSize,
    setSize: (size: Size) => {
      actions.patchWindowSpec(windowId, { size });
    },
  };
}
