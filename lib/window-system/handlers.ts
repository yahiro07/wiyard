import { startDragSessionEx } from "../utils/drag-session";
import { vectorOp } from "../utils/geometry-helper";
import { actions } from "./store";
import { WindowCoordViewModel } from "./window-view-models";

type IPointerEvent = React.PointerEvent<HTMLElement>;

export const unitWindowHandlers = {
  handleBasePointerDown(_: IPointerEvent, windowId: string) {
    actions.setCurrentWindowId(windowId);
  },
  handleTitleBarPointerDown(
    e0: IPointerEvent,
    windowCoordVm: WindowCoordViewModel,
  ) {
    const unitOriginalPos = windowCoordVm.position;
    startDragSessionEx(e0, {
      onMove(_, delta) {
        const newPos = vectorOp.add(unitOriginalPos, delta);
        windowCoordVm.setPosition(newPos);
      },
      onTap() {
        actions.setWindowsEvacuated(false);
        actions.setCurrentWindowId(windowCoordVm.windowId);
      },
    });
    e0.stopPropagation();
  },
  handleResizingAnchorPointerDown(
    e0: IPointerEvent,
    windowCoordVm: WindowCoordViewModel,
  ) {
    const originalSize = windowCoordVm.size;
    startDragSessionEx(e0, {
      onMove(_, delta) {
        const scale = 1 - delta.y / 100;
        const newSize = {
          width: Math.round(originalSize.width * scale),
          height: Math.round(originalSize.height * scale),
        };
        windowCoordVm.setSize(newSize);
      },
    });
    e0.stopPropagation();
  },
};
