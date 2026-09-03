import { appConfig } from "@/definitions/app-config";
import { StageUnitItem } from "@/definitions/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { WindowCoordViewModel } from "@/store/view-models";
import { startDragSession } from "@/utils/drag-session";

export const unitCardHandlers = {
  handlePointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    unitItem: StageUnitItem,
  ) {
    const unitOriginalPos = unitItem.cardPosition;
    startDragSession(e0.nativeEvent, {
      onMove(e) {
        const deltaX = e.position.x - e.originalPosition.x;
        const deltaY = e.position.y - e.originalPosition.y;
        const newPos = {
          x: unitOriginalPos.x + deltaX,
          y: unitOriginalPos.y + deltaY,
        };
        actions.setUnitCardPosition(unitItem.unitId, newPos);
      },
      onTap() {
        if (unitItem.type === "board") {
          if (store.state.currentEffectUnitId === unitItem.unitId) {
            actions.toggleWindowsEvacuated();
          } else {
            actions.setCurrentEffectUnitId(unitItem.unitId);
            actions.setWindowsEvacuated(false);
          }
        }
      },
    });
  },
};

export const unitWindowHandlers = {
  handleTitleBarPointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    windowCoordVm: WindowCoordViewModel,
  ) {
    const unitOriginalPos = windowCoordVm.position;
    startDragSession(e0.nativeEvent, {
      onMove(e) {
        const deltaX = e.position.x - e.originalPosition.x;
        const deltaY = e.position.y - e.originalPosition.y;
        const newPos = {
          x: unitOriginalPos.x + deltaX,
          y: unitOriginalPos.y + deltaY,
        };
        windowCoordVm.setPosition(newPos);
      },
      onTap() {
        actions.toggleWindowsEvacuated();
      },
    });
  },
};

export const deskAreaHandlers = {
  handlePointerDown(e0: React.PointerEvent<HTMLDivElement>) {
    if (e0.currentTarget === e0.target) {
      startDragSession(e0.nativeEvent, {
        onTap() {
          if (appConfig.evacuateWindowsOnTapDesk) {
            actions.toggleWindowsEvacuated();
          }
        },
      });
    }
  },
};
