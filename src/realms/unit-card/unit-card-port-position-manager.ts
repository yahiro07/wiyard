import { useLayoutEffect, useState } from "react";
import { PortStuff, UnitItem, UnitPortSpec } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { domRectOp, vectorOp } from "@/utils/geometry-helper";
import { mapObjectValues } from "@/utils/helpers";

export type UnitCardPortPositionManager = {
  setBaseElement(baseEl: HTMLDivElement): () => void;
  registerPort(portSpec: UnitPortSpec, element: HTMLElement | null): () => void;
  updateLayout(): void;
};

type PortEntry = {
  portSpec: UnitPortSpec;
  element: HTMLElement;
};

export function createUnitCardPortPositionManager(
  unitId: string,
): UnitCardPortPositionManager {
  const portEntries: Record<string, PortEntry> = {};
  let baseEl: HTMLDivElement | undefined;

  const internal = {
    updateLayout() {
      const unitItem = store.state.unitItems.find((it) => it.unitId === unitId);
      if (!unitItem) return;
      const cardPos = unitItem.cardPosition;

      if (!baseEl) return;
      const baseRect = baseEl.getBoundingClientRect();
      const baseCenter = domRectOp.getCenter(baseRect);

      const attrs = mapObjectValues(portEntries, (portEntry) => {
        const rect = portEntry.element.getBoundingClientRect();
        const portPosition = domRectOp.getCenter(rect);
        const relativePosition = vectorOp.subtract(portPosition, baseCenter);
        const position = vectorOp.add(cardPos, relativePosition);

        const { direction, subtype } = portEntry.portSpec;
        const portStuff: PortStuff = {
          portKey: portEntry.portSpec.portKey,
          direction,
          subtype,
          unitId: unitItem.unitId,
          position,
        };
        return portStuff;
      });
      actions.patchPortStuffs(attrs);
    },
    setupObserver(baseEl: HTMLDivElement) {
      const observer = new ResizeObserver(internal.updateLayout);
      observer.observe(baseEl);
      return () => {
        observer.disconnect();
        actions.removePortStuffsForUnit(unitId);
      };
    },
  };

  return {
    setBaseElement(_baseEl) {
      baseEl = _baseEl;
      return internal.setupObserver(baseEl);
    },
    updateLayout() {
      internal.updateLayout();
    },
    registerPort(portSpec, element) {
      if (!element) return () => {};
      const { portKey } = portSpec;
      portEntries[portKey] = { portSpec, element: element };
      return () => {
        delete portEntries[portKey];
      };
    },
  };
}

export function useUnitCardPortPositionManager(
  unitItem: UnitItem,
): UnitCardPortPositionManager {
  const [portPositionManager] = useState(() =>
    createUnitCardPortPositionManager(unitItem.unitId),
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: implicit dependency
  useLayoutEffect(() => {
    portPositionManager.updateLayout();
  }, [unitItem.cardPosition, portPositionManager]);
  return portPositionManager;
}
