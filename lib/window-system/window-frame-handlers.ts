import { startDragSessionEx } from "@lib/utils/drag-session";
import { actions, storeSlice } from "./store";
import { BoundsAnchor, windowPlacementHelper } from "./window-placement-logic";
import { WindowCoordViewModel } from "./window-view-models";

type IPointerEvent = React.PointerEvent<HTMLElement>;

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
      const originalWindowBounds = windowCoordVm.windowBounds;
      startDragSessionEx(
        e0,
        {
          onMove(_, delta) {
            const bounds = windowPlacementHelper.updatePosition(
              originalWindowBounds,
              delta,
            );
            windowCoordVm.setWindowBounds(bounds);
          },
          onHold() {
            // actions.toggleWindowMinimized(windowCoordVm.windowId);
          },
        },
        { holdDurationTh: 300 },
      );
    }

    e0.stopPropagation();
  },
  handleResizingAnchorPointerDown(
    e0: IPointerEvent,
    windowCoordVm: WindowCoordViewModel,
    anchor: BoundsAnchor,
  ) {
    const originalWindowBounds = windowCoordVm.windowBounds;
    const contentAspectRatioSpec = windowCoordVm.contentAspectRatioSpec;
    const minContentSize = { width: 100, height: 75 };

    startDragSessionEx(e0, {
      onMove(_, delta) {
        const bounds = windowPlacementHelper.updateSize(
          originalWindowBounds,
          anchor,
          delta,
          { contentAspectRatioSpec, minContentSize },
        );
        if (bounds) {
          windowCoordVm.setWindowBounds(bounds);
        }
      },
    });
    e0.stopPropagation();
  },
  handleSideTabPointerDown(
    e0: IPointerEvent,
    windowCoordVm: WindowCoordViewModel,
  ) {
    actions.setCurrentWindowId(windowCoordVm.windowId);
    const originalWindowBounds = windowCoordVm.windowBounds;
    startDragSessionEx(
      e0,
      {
        onMove(_, delta) {
          const bounds = windowPlacementHelper.updatePosition(
            originalWindowBounds,
            delta,
          );
          windowCoordVm.setWindowBounds(bounds);
        },
        onTap() {
          actions.toggleWindowMinimized(windowCoordVm.windowId);
        },
      },
      { holdDurationTh: 300 },
    );
    e0.stopPropagation();
  },
};
