import { actions } from "@/store/actions";

export type UnitCardPortPositionManager = {
  setupResizeObserver(baseEl: HTMLDivElement): () => void;
  setPortElement(portKey: string, el: HTMLElement | null): () => void;
};

export function createUnitCardPortPositionManager(): UnitCardPortPositionManager {
  const portElements: Record<string, HTMLElement> = {};
  return {
    setupResizeObserver(baseEl) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const baseRect = baseEl.getBoundingClientRect();
          const baseCenter = {
            x: baseRect.left + baseRect.width / 2,
            y: baseRect.top + baseRect.height / 2,
          };
          for (const portKey in portElements) {
            const el = portElements[portKey];
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            const relativePos = {
              x: rect.left + rect.width / 2 - baseCenter.x,
              y: rect.top + rect.height / 2 - baseCenter.y,
            };
            actions.setPortRelativePosition(portKey, relativePos);
          }
        }
      });
      observer.observe(baseEl);
      return () => {
        observer.disconnect();
      };
    },
    setPortElement(portKey, el) {
      if (!el) return () => {};
      portElements[portKey] = el;
      return () => {
        delete portElements[portKey];
        actions.setPortRelativePosition(portKey, null);
      };
    },
  };
}
