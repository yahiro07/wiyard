import { appConfig } from "@/domain/app-config";
import { StageUnitItem } from "@/domain/types";
import { WindowCoordViewModel } from "@/presenter/window-view-models";
import { actions } from "@/store/actions";
import { startDragSessionV0 } from "@/utils/drag-session-v0";
import { vectorOp } from "@/utils/geometry-helper";

export const unitCardHandlers = {
  handlePointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    unitItem: StageUnitItem,
  ) {
    const unitOriginalPos = unitItem.cardPosition;
    startDragSessionV0(e0.nativeEvent, {
      onMove(e) {
        const delta = vectorOp.subtract(e.position, e.originalPosition);
        const newPos = vectorOp.add(unitOriginalPos, delta);
        actions.setUnitCardPosition(unitItem.unitId, newPos);
      },
      onTap() {
        if (unitItem.type === "board") {
          actions.setCurrentEffectUnitId(unitItem.unitId);
          actions.setWindowsEvacuated(false);
        } else if (
          unitItem.type === "edge" &&
          unitItem.internalUnitKey === "noteInputPort"
        ) {
          actions.setSequencerWindowVisible(true);
          actions.setCurrentNoteChannelId(unitItem.noteChannelId);
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
    startDragSessionV0(e0.nativeEvent, {
      onMove(e) {
        const delta = vectorOp.subtract(e.position, e.originalPosition);
        const newPos = vectorOp.add(unitOriginalPos, delta);
        windowCoordVm.setPosition(newPos);
      },
      onTap() {
        actions.setWindowsEvacuated(false);
      },
    });
  },
};

export const deskAreaHandlers = {
  handlePointerDown(e0: React.PointerEvent<HTMLDivElement>) {
    if (e0.currentTarget === e0.target) {
      startDragSessionV0(e0.nativeEvent, {
        onTap() {
          if (appConfig.evacuateWindowsOnTapDesk) {
            actions.toggleWindowsEvacuated();
          }
        },
      });
    }
  },
};
