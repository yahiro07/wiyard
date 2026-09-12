import { createDragSessionEx, startDragSessionEx } from "../utils/drag-session";
import { sizeOp, vectorOp } from "../utils/geometry-helper";
import { actions, storeSlice } from "./store";
import { WindowCoordViewModel } from "./window-view-models";

type IPointerEvent = React.PointerEvent<HTMLElement>;

function getDeskAreaElement() {
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
    const deskAreaElement = getDeskAreaElement();
    const originalSize = windowCoordVm.size;
    const dragSession = createDragSessionEx(e0, {
      coordinateBaseElement: deskAreaElement,
    });
    const centerP = windowCoordVm.position;
    const p0 = dragSession.startPosition;
    const baseDelta = vectorOp.subtract(p0, centerP);
    const oppositeP = vectorOp.subtract(centerP, baseDelta);

    dragSession.run({
      onMove(p1) {
        const scale =
          vectorOp.distance(p1, oppositeP) / vectorOp.distance(p0, oppositeP);
        const newSize = sizeOp.rounded(sizeOp.scale(originalSize, scale));
        const newPos = vectorOp.add(
          oppositeP,
          vectorOp.scale(baseDelta, scale),
        );
        windowCoordVm.setPosition(newPos);
        windowCoordVm.setSize(newSize);
      },
    });
    e0.stopPropagation();
  },
};
