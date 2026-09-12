import { startDragSessionEx } from "../utils/drag-session";
import { vectorOp } from "../utils/geometry-helper";
import { actions, storeSlice } from "./store";
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
    const isEvacuated = storeSlice.get().windowsEvacuated;
    if (isEvacuated) {
      startDragSessionEx(e0, {
        onTap() {
          actions.setWindowsEvacuated(false);
        },
      });
    } else {
      actions.setCurrentWindowId(windowCoordVm.windowId);
      const unitOriginalPos = windowCoordVm.position;

      let latestDist = 0;

      let timerId: NodeJS.Timeout | undefined = setTimeout(() => {
        if (latestDist < 4) {
          actions.toggleWindowMinimized(windowCoordVm.windowId);
        }
      }, 250);

      const cancelTimer = () => {
        if (timerId) {
          clearTimeout(timerId);
          timerId = undefined;
        }
      };

      startDragSessionEx(e0, {
        onMove(_, delta) {
          const newPos = vectorOp.add(unitOriginalPos, delta);
          windowCoordVm.setPosition(newPos);
          latestDist = Math.hypot(delta.x, delta.y);
        },
        onEnd() {
          cancelTimer();
        },
      });
    }

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
