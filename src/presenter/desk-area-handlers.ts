import { appConfig } from "@/domain/app-config";
import { kSequencerWindowId, StageUnitItem } from "@/domain/types";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";
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
          windowSystem.setEvacuate(false);
          actions.setWindowStatus(unitItem.unitId, "visible");
          windowSystem.setCurrentWindow(unitItem.unitId);
        } else if (
          unitItem.type === "edge" &&
          unitItem.internalUnitKey === "noteInputPort"
        ) {
          const isCurrent =
            store.state.currentNoteChannelId === unitItem.noteChannelId;
          if (isCurrent) {
            actions.setWindowStatus(kSequencerWindowId, "visible");
            windowSystem.setEvacuate(false);
          } else {
            actions.setCurrentNoteChannelId(unitItem.noteChannelId);
            windowSystem.setCurrentWindow(kSequencerWindowId);
          }
        }
      },
      onEnd() {
        cancelTimer();
      },
    });
  },
};

export const deskAreaHandlers = {
  handlePointerDown(e0: IPointerEvent) {
    if (e0.currentTarget === e0.target) {
      startDragSessionEx(e0, {
        onTap() {
          if (appConfig.evacuateWindowsOnTapDesk) {
            windowSystem.toggleEvacuate();
          }
        },
      });
    }
    actions.setMenuTargetUnit(null);
  },
};
