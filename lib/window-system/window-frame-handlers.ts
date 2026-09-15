import { startDragSessionEx } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { actions, storeSlice } from "./store";
import { BoundsAnchor, updateWindowBounds } from "./window-placement-logic";
import { WindowCoordViewModel } from "./window-view-models";

type IPointerEvent = React.PointerEvent<HTMLElement>;

function getDeskAreaElement() {
  //todo: pass desk area element from app to window system
  return document.getElementById("domDeskArea") as HTMLElement;
}

export const windowFrameHandlers = {
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
          // actions.toggleWindowMinimized(windowCoordVm.windowId);
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
    anchor: BoundsAnchor,
  ) {
    const originalWindowBounds = windowCoordVm.windowBounds;
    const coordinateBaseElement = getDeskAreaElement();
    startDragSessionEx(
      e0,
      {
        onMove(_, delta) {
          const bounds = updateWindowBounds(
            originalWindowBounds,
            anchor,
            delta,
            {
              contentAspectRatioSpec: windowCoordVm.contentAspectRatioSpec,
              minContentSize: { width: 100, height: 75 },
            },
          );
          windowCoordVm.setWindowBounds(bounds);
        },
      },
      { coordinateBaseElement },
    );
    e0.stopPropagation();
  },
};
