import { FC, useMemo, useRef } from "react";
import { useWindowSize } from "../../utils/use-window-size";
import { useDomElementSize } from "../../utils/use-dom-element-size";
import { bottomLimit, topLimit } from "@lib/utils/number-helper";

const UiScaler: FC<{
  children: React.ReactNode;
  scale: number;
  originalWidth: number;
  originalHeight: number;
}> = ({ children, scale, originalWidth, originalHeight }) => {
  if (scale === 1)
    return (
      <div>
        <div>{children}</div>
      </div>
    );
  return (
    <div
      style={{
        position: "relative",
        display: "block",
        width: `${originalWidth * scale}px`,
        height: `${originalHeight * scale}px`,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
          width: `${originalWidth}px`,
          height: `${originalHeight}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ScalerBoxD: FC<{
  children: React.ReactNode;
  designWidth: number;
  designHeight: number;
}> = ({ children, designWidth, designHeight }) => {
  const win = useWindowSize();
  const scale = Math.min(win.width / designWidth, win.height / designHeight);
  return (
    <UiScaler
      scale={scale}
      originalWidth={designWidth}
      originalHeight={designHeight}
    >
      {children}
    </UiScaler>
  );
};

export const ScalerBoxDW: FC<{
  children: React.ReactNode;
  designWidth: number;
  scaleDirection: "lower" | "upper" | "both";
}> = ({ children, designWidth, scaleDirection }) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const size = useDomElementSize(baseDivRef);
  const [scale, designHeight] = useMemo(() => {
    if (size) {
      let sc = size.width / designWidth;
      const asr = size.width / size.height;
      if (scaleDirection === "lower") {
        sc = topLimit(sc, 1);
      } else if (scaleDirection === "upper") {
        sc = bottomLimit(sc, 1);
      }
      return [sc, designWidth / asr];
    } else {
      return [1, 1];
    }
  }, [size, scaleDirection]);
  return (
    <div ref={baseDivRef} style={{ height: "100%", overflow: "hidden" }}>
      <UiScaler
        scale={scale}
        originalWidth={designWidth}
        originalHeight={designHeight}
      >
        {children}
      </UiScaler>
    </div>
  );
};
