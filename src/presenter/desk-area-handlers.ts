import { appConfig } from "@/domain/app-config";
import { kSequencerWindowId, StageUnitItem } from "@/domain/types";
import { WindowCoordViewModel } from "@/presenter/window-view-models";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { startDragSessionEx } from "@/utils/drag-session";
import { vectorOp } from "@/utils/geometry-helper";

export function getDeskAreaElement() {
  return document.getElementById("domDeskArea") as HTMLElement;
}

type IPointerEvent = React.PointerEvent<HTMLElement>;

export const unitCardHandlers = {
  handlePointerDown(e0: IPointerEvent, unitItem: StageUnitItem) {
    const unitOriginalPos = unitItem.cardPosition;
    let prevPos = unitOriginalPos;

    let timerId: NodeJS.Timeout | undefined = setTimeout(() => {
      if (prevPos === unitOriginalPos) {
        actions.setMenuTargetUnit(unitItem.unitId);
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
        const newPos = vectorOp.snapped(
          vectorOp.add(unitOriginalPos, delta),
          10,
        );
        if (!vectorOp.equals(prevPos, newPos)) {
          actions.setUnitCardPosition(unitItem.unitId, newPos);
          prevPos = newPos;
          cancelTimer();
          actions.setMenuTargetUnit(null);
        }
      },
      onTap() {
        if (unitItem.type === "board") {
          actions.setWindowsEvacuated(false);
          actions.setWindowStatus(unitItem.unitId, "visible");
          actions.setCurrentWindowId(unitItem.unitId);
        } else if (
          unitItem.type === "edge" &&
          unitItem.internalUnitKey === "noteInputPort"
        ) {
          const isCurrent =
            store.state.currentNoteChannelId === unitItem.noteChannelId;
          if (isCurrent) {
            actions.setWindowStatus(kSequencerWindowId, "visible");
            actions.setWindowsEvacuated(false);
          } else {
            actions.setCurrentNoteChannelId(unitItem.noteChannelId);
            actions.setCurrentWindowId(unitItem.unitId);
          }
        }
      },
      onEnd() {
        cancelTimer();
      },
    });
  },
};

export const unitWindowHandlers = {
  handleBasePointerDown(e0: IPointerEvent, windowId: string) {
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

export const deskAreaHandlers = {
  handlePointerDown(e0: IPointerEvent) {
    if (e0.currentTarget === e0.target) {
      startDragSessionEx(e0, {
        onTap() {
          if (appConfig.evacuateWindowsOnTapDesk) {
            actions.toggleWindowsEvacuated();
          }
        },
      });
    }
    actions.setMenuTargetUnit(null);
  },
};
