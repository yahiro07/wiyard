import { Point, Size } from "@/domain/common-types";
import { StageUnitItem } from "@/domain/types";
import { actionsInternal } from "@/store/actions";
import { store } from "@/store/store";

export type WindowCoordViewModel = {
  position: Point;
  setPosition: (position: Point) => void;
  size: Size;
};

export function useWindowCoordViewModel(
  unitItem: StageUnitItem,
): WindowCoordViewModel {
  const windowSize: Size = { width: 300, height: 200 };
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

export function useSequencerWindowViewModel(): WindowCoordViewModel {
  const { sequencerWindowPosition } = store.useSnapshot();
  return {
    position: sequencerWindowPosition,
    setPosition: (position: Point) => {
      store.setSequencerWindowPosition(position);
    },
    size: { width: 380 + 190, height: 300 },
  };
}
