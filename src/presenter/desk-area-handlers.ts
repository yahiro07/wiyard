import { appConfig } from "@/domain/app-config";
import { StageUnitItem } from "@/domain/types";
import { WindowCoordViewModel } from "@/presenter/window-view-models";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { startDragSessionEx } from "@/utils/drag-session";
import { vectorOp } from "@/utils/geometry-helper";

export const unitCardHandlers = {
  handlePointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    unitItem: StageUnitItem,
  ) {
    const unitOriginalPos = unitItem.cardPosition;
    startDragSessionEx(e0, {
      onMove(_, delta) {
        const newPos = vectorOp.snapped(
          vectorOp.add(unitOriginalPos, delta),
          10,
        );
        if (!vectorOp.equals(unitOriginalPos, newPos)) {
          actions.setUnitCardPosition(unitItem.unitId, newPos);
        }
      },
      onTap() {
        if (unitItem.type === "board") {
          actions.setCurrentEffectUnitId(unitItem.unitId);
          actions.setWindowsEvacuated(false);
        } else if (
          unitItem.type === "edge" &&
          unitItem.internalUnitKey === "noteInputPort"
        ) {
          const isCurrent =
            store.state.currentNoteChannelId === unitItem.noteChannelId;
          if (isCurrent) {
            actions.setSequencerWindowVisible(true);
            actions.setWindowsEvacuated(false);
          } else {
            actions.setCurrentNoteChannelId(unitItem.noteChannelId);
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
    startDragSessionEx(e0, {
      onMove(_, delta) {
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
      startDragSessionEx(e0, {
        onTap() {
          if (appConfig.evacuateWindowsOnTapDesk) {
            actions.toggleWindowsEvacuated();
          }
        },
      });
    }
  },
};
