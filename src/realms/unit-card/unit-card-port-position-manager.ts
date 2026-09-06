import { useLayoutEffect, useState } from "react";
import { PortStuff, UnitPortSpec } from "@/domain/types";
import { actions } from "@/store/actions";
import { Point } from "@/utils/drag-session";

export type UnitCardPortPositionManager = {
  setBaseElement(baseEl: HTMLDivElement): () => void;
  registerPort(portSpec: UnitPortSpec, element: HTMLElement | null): () => void;
  updateLayout(): void;
};

type PortEntry = {
  portSpec: UnitPortSpec;
  element: HTMLElement;
};

export function createUnitCardPortPositionManager(): UnitCardPortPositionManager {
  const portEntries: Record<string, PortEntry> = {};

  const internal = {
    updateLayout() {
      for (const portKey in portEntries) {
        const portEntry = portEntries[portKey];
        const rect = portEntry.element.getBoundingClientRect();
        const unitId = portKey.split(".")[0];
        const position = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const { direction, subtype } = portEntry.portSpec;
        const portStuff: PortStuff = {
          portKey,
          direction,
          subtype,
          unitId,
          position,
        };
        actions.setPortStuff(portKey, portStuff);
      }
    },
  };

  return {
    setBaseElement(baseEl) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          internal.updateLayout();
        }
      });
      observer.observe(baseEl);
      return () => {
        observer.disconnect();
      };
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
        actions.setPortStuff(portKey, null);
      };
    },
  };
}

export function useUnitCardPortPositionManager(
  cardPosition: Point,
): UnitCardPortPositionManager {
  const [portPositionManager] = useState(createUnitCardPortPositionManager);
  // biome-ignore lint/correctness/useExhaustiveDependencies: implicit dependency
  useLayoutEffect(() => {
    portPositionManager.updateLayout();
  }, [cardPosition, portPositionManager]);
  return portPositionManager;
}
