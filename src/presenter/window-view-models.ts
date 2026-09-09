import { Point, Size } from "@/domain/common-types";
import { StageUnitItem } from "@/domain/types";
import { actionsInternal } from "@/store/actions";
import { store } from "@/store/store";

export type WindowCoordViewModel = {
  position: Point;
  setPosition: (position: Point) => void;
  size: Size;
};

const fallbackSize = { width: 300, height: 200 };

export function useWindowCoordViewModel(
  unitItem: StageUnitItem,
): WindowCoordViewModel {
  const { unitStuffs } = store.useSnapshot();
  const size = unitStuffs[unitItem.unitId]?.viewSize ?? fallbackSize;

  return {
    position: unitItem.windowPosition,
    setPosition: (position: Point) => {
      actionsInternal.patchUnitAttrs(unitItem.unitId, {
        windowPosition: position,
      });
    },
    size,
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
