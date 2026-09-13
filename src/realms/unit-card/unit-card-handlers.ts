import { startDragSessionEx } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { kSequencerWindowId, UnitItem } from "@/domain/types";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";

type IPointerEvent = React.PointerEvent<HTMLElement>;

export const unitCardHandlers = {
  handlePointerDown(e0: IPointerEvent, unitItem: UnitItem) {
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
        } else if (unitItem.type === "noteInput") {
          const isCurrentNoteCh =
            store.state.currentNoteChannelId === unitItem.unitId;
          if (isCurrentNoteCh) {
            windowSystem.setEvacuate(false);
            actions.setWindowStatus(kSequencerWindowId, "visible");
            windowSystem.setCurrentWindow(kSequencerWindowId);
          } else {
            actions.setCurrentNoteChannelId(unitItem.unitId);
          }
        }
      },
      onEnd() {
        cancelTimer();
      },
    });
  },
};
