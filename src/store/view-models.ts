import { appConfig } from "@/definitions/app-config";
import { StageUnitItem } from "@/definitions/unit-entries";
import { actionsInternal } from "@/store/actions";
import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";

export type WindowCoordViewModel = {
  position: Point;
  setPosition: (position: Point) => void;
};

export const useWindowCoordViewModel = (
  unitItem: StageUnitItem,
): WindowCoordViewModel => {
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
};

export const useSequencerWindowViewModel = (): WindowCoordViewModel => {
  const { sequencerWindowPosition } = store.useSnapshot();
  return {
    position: sequencerWindowPosition,
    setPosition: (position: Point) => {
      store.setSequencerWindowPosition(position);
    },
  };
};
