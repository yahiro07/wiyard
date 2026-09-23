import { Size } from "@lib/utils/common-types";
import { cz } from "@lib/utils/cz";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import React, { useMemo, useRef } from "react";

export type FieldSight = {
  eyeScaling: number;
  eyeOffset: { x: number; y: number };
};

export const FieldSightPlane = ({
  className,
  sight,
  children,
  boardSize,
}: {
  className?: string;
  sight: FieldSight;
  children: React.ReactNode;
  boardSize: Size;
}) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const outerAreaSize = useDomElementSize(baseDivRef);

  const transformSpec = useMemo(() => {
    if (!outerAreaSize) return undefined;
    const tx = outerAreaSize.width / 2 + sight.eyeOffset.x;
    const ty = outerAreaSize.height / 2 + sight.eyeOffset.y;
    const sc = sight.eyeScaling;
    const tx2 = boardSize.width / 2;
    const ty2 = boardSize.height / 2;
    return `translate(${tx}px, ${ty}px) scale(${sc}) translate(${-tx2}px, ${-ty2}px)`;
  }, [sight, outerAreaSize, boardSize]);

  return (
    <div
      ref={baseDivRef}
      className={cz(
        "w-full h-full relative overflow-hidden pointer-events-none",
        className,
      )}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: transformSpec,
          transformOrigin: "top left",
        }}
      >
        <div
          className="pointer-events-auto"
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
