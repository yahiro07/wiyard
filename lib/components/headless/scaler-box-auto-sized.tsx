import { useDomElementSize } from "../../utils/use-dom-element-size";
import { ReactNode, useMemo, useRef } from "react";

export function ScalerBoxAutoSized({
  children,
  overflow,
  fitMode = "contain",
}: {
  children: ReactNode;
  overflow?: "visible" | "hidden";
  fitMode?: "contain" | "cover";
}) {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const innerDivRef = useRef<HTMLDivElement>(null);

  const outerSize = useDomElementSize(baseDivRef);
  const innerSize = useDomElementSize(innerDivRef);

  const scale = useMemo(() => {
    if (!outerSize || !innerSize) return 1;
    if (innerSize.width === 0 || innerSize.height === 0) return 1;
    const minMaxFn = fitMode === "contain" ? Math.min : Math.max;
    return minMaxFn(
      outerSize.width / innerSize.width,
      outerSize.height / innerSize.height,
    );
  }, [outerSize, innerSize]);

  const isReady = outerSize && innerSize && innerSize.width > 0;

  return (
    <div
      ref={baseDivRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow,
      }}
    >
      <div
        ref={innerDivRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          visibility: isReady ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
