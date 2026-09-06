import { useLayoutEffect, useState } from "react";
import { PortStuff, StageUnitItem, UnitPortSpec } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
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
      if (!(unitItem?.type === "board" || unitItem?.type === "edge")) return;
      const cardPos = unitItem.cardPosition;

      if (!baseEl) return;
      const baseRect = baseEl.getBoundingClientRect();
      const baseCenter = {
        x: baseRect.left + baseRect.width / 2,
        y: baseRect.top + baseRect.height / 2,
      };

      const attrs = mapObjectValues(portEntries, (portEntry) => {
        const rect = portEntry.element.getBoundingClientRect();
        const relativePosition = {
          x: rect.left + rect.width / 2 - baseCenter.x,
          y: rect.top + rect.height / 2 - baseCenter.y,
        };
        const position = {
          x: cardPos.x + relativePosition.x,
          y: cardPos.y + relativePosition.y,
        };

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
  unitItem: StageUnitItem,
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
