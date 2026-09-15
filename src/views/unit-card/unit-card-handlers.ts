import { startDragSessionEx } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { getGraphEditPlaneElement } from "@/common/constants";
import { UnitItem } from "@/domain/types";
import { actions } from "@/store/actions";
import { windowSystem } from "@/store/store";

type IPointerEvent = React.PointerEvent<HTMLElement>;

export const unitCardHandlers = {
  handlePointerDown(e0: IPointerEvent, unitItem: UnitItem) {
    const unitOriginalPos = unitItem.cardPosition;
    let prevPos = unitOriginalPos;
    const baseEl = getGraphEditPlaneElement();

    startDragSessionEx(
      e0,
      {
        onMove(_, delta) {
          const newPos = vectorOp.snapped(
            vectorOp.add(unitOriginalPos, delta),
            10,
          );
          if (!vectorOp.equals(prevPos, newPos)) {
            actions.setUnitCardPosition(unitItem.unitId, newPos);
            prevPos = newPos;
            actions.setMenuTargetUnit(null);
          }
        },
        onTap() {
          if (unitItem.type === "board") {
            windowSystem.setEvacuate(false);
            actions.setWindowStatus(unitItem.unitId, "visible");
            windowSystem.setCurrentWindow(unitItem.unitId);
          } else if (unitItem.type === "noteInput") {
            actions.setCurrentNoteChannelId(unitItem.unitId);
          }
        },
        onHold() {
          actions.setMenuTargetUnit(unitItem.unitId);
        },
      },
      { coordinateBaseElement: baseEl },
    );
  },
};
