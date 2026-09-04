import { useMemo } from "react";
import { appConfig } from "@/definitions/app-config";
import { EdgeUnitItem, StageUnitItem } from "@/definitions/unit-entries";
import { actionsInternal } from "@/store/actions";
import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";

export type WindowCoordViewModel = {
  position: Point;
  setPosition: (position: Point) => void;
};

export function useWindowCoordViewModel(
  unitItem: StageUnitItem,
): WindowCoordViewModel {
  const { sharedWindowPosition } = store.useSnapshot();
  if (appConfig.shareWindowCoordForUnits) {
    return {
      position: sharedWindowPosition,
      setPosition: (position: Point) => {
        store.setSharedWindowPosition(position);
      },
    };
  } else {
    return {
      position: unitItem.windowPosition,
      setPosition: (position: Point) => {
        actionsInternal.patchUnitAttrs(unitItem.unitId, {
          windowPosition: position,
        });
      },
    };
  }
}

export function useSequencerWindowViewModel(): WindowCoordViewModel {
  const { sequencerWindowPosition } = store.useSnapshot();
  return {
    position: sequencerWindowPosition,
    setPosition: (position: Point) => {
      store.setSequencerWindowPosition(position);
    },
  };
}

export function useNoteOutputPortIndex(noteChannelId: string) {
  const { unitItems } = store.useSnapshot();
  return useMemo(() => {
    const noteInputPortItems = unitItems.filter(
      (item) =>
        item.type === "edge" && item.internalUnitKey === "noteInputPort",
    ) as EdgeUnitItem[];
    return noteInputPortItems.findIndex(
      (item) => item.noteChannelId === noteChannelId,
    );
  }, [unitItems, noteChannelId]);
}
