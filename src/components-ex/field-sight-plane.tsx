import { clampValue } from "beams/ax/number-utils";
import { Size } from "beams/ax-ui/common-types";
import { startDragSession } from "beams/ax-ui/drag-session";
import { useDomElementSize } from "beams/mo-react/hooks/use-dom-element-size";
import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";

export type FieldSight = {
  zoom: number; //0 for 1x
  eyeOffset: { x: number; y: number };
};

export type FieldSightHandlers = {
  onWheel: (e: WheelEvent) => void;
  onPointerDown: (e: PointerEvent) => void;
};

export function createFieldSightHandlers(
  getSight: () => FieldSight,
  setSightAttrs: (newSight: Partial<FieldSight>) => void,
  configs: { minZoom: number; maxZoom: number },
): FieldSightHandlers {
  return {
    onWheel(e: WheelEvent) {
      const sight = getSight();
      const zoom = sight.zoom;
      const newZoom = clampValue(
        zoom - e.deltaY * 0.005,
        configs.minZoom,
        configs.maxZoom,
      );
      const scale = Math.pow(2, zoom);
      const newScale = Math.pow(2, newZoom);
      const scaleRatio = newScale / scale;
      setSightAttrs({
        zoom: newZoom,
        eyeOffset: {
          x: sight.eyeOffset.x * scaleRatio,
          y: sight.eyeOffset.y * scaleRatio,
        },
      });
    },
    onPointerDown(e0: PointerEvent) {
      if (e0.buttons === 4) {
        const startPos = getSight().eyeOffset;
        startDragSession(
          e0,
          {
            onMove(e) {
              const relX = e.position.x - e.originalPosition.x;
              const relY = e.position.y - e.originalPosition.y;
              const newPos = {
                x: startPos.x + relX,
                y: startPos.y + relY,
              };
              setSightAttrs({ eyeOffset: newPos });
            },
          },
          { coordinate: "screen" },
        );
        e0.stopPropagation();
        e0.preventDefault();
      }
    },
  };
}

export const FieldSightPlane = ({
  className,
  sight,
  handlers,
  children,
  boardSize,
}: {
  className?: string;
  sight: FieldSight;
  handlers: FieldSightHandlers;
  children: React.ReactNode;
  boardSize: Size;
}) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener("pointerdown", handlers.onPointerDown, {
      capture: true,
    });
    return () => {
      window.removeEventListener("pointerdown", handlers.onPointerDown, {
        capture: true,
      });
    };
  }, [handlers]);

  useEffect(() => {
    const baseDiv = baseDivRef.current;
    if (!baseDiv) return;
    const onWheel = (e: WheelEvent) => {
      handlers.onWheel(e);
      e.preventDefault();
    };

    baseDiv.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      baseDiv.removeEventListener("wheel", onWheel);
    };
  }, [handlers]);

  const outerAreaSize = useDomElementSize(baseDivRef);

  const transformSpec = useMemo(() => {
    if (!outerAreaSize) return undefined;
    const tx = outerAreaSize.width / 2 + sight.eyeOffset.x;
    const ty = outerAreaSize.height / 2 + sight.eyeOffset.y;
    const sc = Math.pow(2, sight.zoom);
    const tx2 = boardSize.width / 2;
    const ty2 = boardSize.height / 2;
    return `translate(${tx}px, ${ty}px) scale(${sc}) translate(${-tx2}px, ${-ty2}px)`;
  }, [sight, outerAreaSize, boardSize]);

  return (
    <div
      ref={baseDivRef}
      className={clsx("w-full h-full relative overflow-hidden", className)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: transformSpec,
          transformOrigin: "top left",
          border: "solid 2px #ccc8",
        }}
      >
        <div
          style={{
            width: boardSize.width,
            height: boardSize.height,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
