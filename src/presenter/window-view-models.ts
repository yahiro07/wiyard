import { useEffect } from "react";
import { Point, Size } from "@/domain/common-types";
import { StageUnitItem } from "@/domain/types";
import { actionsInternal } from "@/store/actions";
import { store } from "@/store/store";

export type WindowCoordViewModel = {
  windowUnitId: string;
  position: Point;
  setPosition: (position: Point) => void;
  size: Size;
  setSize: (size: Size) => void;
};

const fallbackSize = { width: 300, height: 200 };

export function useWindowCoordViewModel(
  unitItem: StageUnitItem,
): WindowCoordViewModel {
  const { unitStuffs } = store.useSnapshot();
  const defaultSize = unitStuffs[unitItem.unitId]?.viewSize;

  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    if (defaultSize && !unitItem.windowSize) {
      actionsInternal.patchUnitAttrs(unitItem.unitId, {
        windowSize: defaultSize,
      });
    }
  }, [defaultSize]);

  return {
    windowUnitId: unitItem.unitId,
    position: unitItem.windowPosition,
    setPosition: (position: Point) => {
      actionsInternal.patchUnitAttrs(unitItem.unitId, {
        windowPosition: position,
      });
    },
    size: unitItem.windowSize ?? fallbackSize,
    setSize: (size: Size) => {
      actionsInternal.patchUnitAttrs(unitItem.unitId, {
        windowSize: size,
      });
    },
  };
}

export function useSequencerWindowViewModel(): WindowCoordViewModel {
  const { sequencerWindowPosition } = store.useSnapshot();
  return {
    windowUnitId: "sequencerWindow",
    position: sequencerWindowPosition,
    setPosition: (position: Point) => {
      store.setSequencerWindowPosition(position);
    },
    size: { width: 380 + 190, height: 300 },
    setSize: (size: Size) => {
      // store.setSequencerWindowSize(size);
    },
  };
}
