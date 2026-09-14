import { Point } from "../utils/common-types";
import { createDragSessionEx, startDragSessionEx } from "../utils/drag-session";
import { sizeOp, vectorOp } from "../utils/geometry-helper";
import { actions, storeSlice } from "./store";
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
    anchorInputYOffset: number = 0,
  ) {
    const wrapInputPoint = (p: Point) => {
      return { x: p.x, y: p.y + anchorInputYOffset };
    };

    const deskAreaElement = getDeskAreaElement();
    const originalSize = windowCoordVm.contentSize;
    const dragSession = createDragSessionEx(e0, {
      coordinateBaseElement: deskAreaElement,
    });
    const centerP = windowCoordVm.position;
    const p0 = wrapInputPoint(dragSession.startPosition);
    const baseDelta = vectorOp.subtract(p0, centerP);
    const oppositeP = vectorOp.subtract(centerP, baseDelta);

    //todo: pass per-window-id handling options from app to window system
    const keepAspectRatio = windowCoordVm.windowId !== "sequencerWindow";

    dragSession.run({
      onMove(_p1) {
        const p1 = wrapInputPoint(_p1);
        if (keepAspectRatio) {
          const scale =
            vectorOp.distance(p1, oppositeP) / vectorOp.distance(p0, oppositeP);
          const newSize = sizeOp.rounded(sizeOp.scale(originalSize, scale));
          const newPos = vectorOp.add(
            oppositeP,
            vectorOp.scale(baseDelta, scale),
          );
          windowCoordVm.setPosition(newPos);
          windowCoordVm.setContentSize(newSize);
        } else {
          const newPos = vectorOp.middle(oppositeP, p1);
          const newSize = sizeOp.rounded({
            width: Math.abs(p1.x - oppositeP.x),
            height: Math.abs(p1.y - oppositeP.y),
          });
          windowCoordVm.setPosition(newPos);
          windowCoordVm.setContentSize(newSize);
        }
      },
    });
    e0.stopPropagation();
  },
};
