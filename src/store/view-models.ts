import { useMemo } from "react";
import { appConfig } from "@/definitions/app-config";
import { Size } from "@/definitions/common-types";
import { EdgeUnitItem, StageUnitItem } from "@/definitions/unit-entries";
import { actionsInternal } from "@/store/actions";
import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";

export type WindowCoordViewModel = {
  position: Point;
  setPosition: (position: Point) => void;
  size: Size;
};

export function useWindowCoordViewModel(
  unitItem: StageUnitItem,
): WindowCoordViewModel {
  const { sharedWindowPosition } = store.useSnapshot();
  const windowSize: Size = { width: 600, height: 400 };
  if (appConfig.shareWindowCoordForUnits) {
    return {
      position: sharedWindowPosition,
      setPosition: (position: Point) => {
        store.setSharedWindowPosition(position);
      },
      size: windowSize,
    };
  } else {
    return {
      position: unitItem.windowPosition,
      setPosition: (position: Point) => {
        actionsInternal.patchUnitAttrs(unitItem.unitId, {
          windowPosition: position,
        });
      },
      size: windowSize,
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
    size: { width: 760, height: 400 },
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
