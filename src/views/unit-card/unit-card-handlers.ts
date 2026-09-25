import { startDragSessionEx } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { UnitItem, windowIds } from "@/domain/types";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";
import { cardPlacementHelper } from "@/store/card-placement-helper";

type IPointerEvent = React.PointerEvent<HTMLElement>;

export const unitCardHandlers = {
  handlePointerDown(e0: IPointerEvent, unitItem: UnitItem) {
    const unitOriginalPos = unitItem.cardPosition;
    let prevPos = unitOriginalPos;

    startDragSessionEx(e0, {
      onMove(_, delta) {
        const newPos = vectorOp.snapped(
          cardPlacementHelper.clampCardPositionInGraphPlane(
            vectorOp.add(unitOriginalPos, delta),
            unitItem.type !== "board",
          ),
          10,
        );
        if (!vectorOp.equals(prevPos, newPos)) {
          actions.setUnitCardPosition(unitItem.unitId, newPos);
          prevPos = newPos;
          actions.setMenuTargetUnit(null);
        }
      },
      onTap() {
        const makeWindowActive = (windowId: string) => {
          windowSystem.unMinimizeAll();
          actions.setWindowStatus(windowId, "visible");
          windowSystem.setCurrentWindow(windowId);
        };
        if (unitItem.type === "board") {
          makeWindowActive(unitItem.unitId);
        } else if (unitItem.type === "noteInput") {
          const isCurrent =
            store.state.currentNoteChannelId === unitItem.unitId;
          if (!isCurrent) {
            actions.setCurrentNoteChannelId(unitItem.unitId);
          } else {
            makeWindowActive(windowIds.pianoRoll);
          }
        } else if (unitItem.type === "controlSurface") {
          makeWindowActive(windowIds.controlSurface);
        } else if (unitItem.type === "automationEditor") {
          makeWindowActive(windowIds.automationEditor);
        }
      },
      onHold() {
        actions.setMenuTargetUnit(unitItem.unitId);
      },
    });
  },
};
