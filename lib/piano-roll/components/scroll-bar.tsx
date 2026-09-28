import { colorMod } from "@lib/utils/color-mod";
import { colorStyle } from "@lib/utils/color-style";
import { cz } from "@lib/utils/cz";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { useRef } from "react";
import { KnobFrame } from "@lib/components/headless/knob-frame";

const colorStyles = {
  base: colorStyle({ bg: colorMod("#404046", "v-2 h220"), bd: "#2c2c2c" }),
  track: colorStyle({
    bg: colorMod("#568", "v-18 s-20 h220"),
    bd: colorMod("#568", "v-10 s-20"),
  }),
};

export const ScrollBarH = ({
  trackOffset,
  trackLength,
  fullLength,
  step,
  onChange,
}: {
  trackOffset: number;
  trackLength: number;
  fullLength: number;
  step: number;
  onChange: (offset: number) => void;
}) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const size = useDomElementSize(baseDivRef);
  const trackOffsetMax = fullLength - trackLength;
  const trackLeftP = trackOffset / fullLength;
  const trackWidthP = trackLength / fullLength;

  const trackMaxP = trackOffsetMax / fullLength;
  const dragRange = size?.width ? size.width * trackMaxP : undefined;

  return (
    <KnobFrame
      value={trackOffset}
      onChange={onChange}
      min={0}
      max={trackOffsetMax}
      step={step}
      horizontal
      dragRange={dragRange}
      cursor="auto"
    >
      <div
        ref={baseDivRef}
        className={cz("w-full h-22px relative")}
        style={colorStyles.base}
      >
        <div
          className={cz("w-200px h-full absolute top-0")}
          style={{
            ...colorStyles.track,
            left: `${trackLeftP * 100}%`,
            width: `${trackWidthP * 100}%`,
          }}
        />
      </div>
    </KnobFrame>
  );
};

export const ScrollBarV = ({
  position,
  onChange,
}: {
  position: number;
  onChange: (position: number) => void;
}) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const size = useDomElementSize(baseDivRef);
  const dragRange = size?.height ? size.height - 200 : undefined;
  return (
    <KnobFrame
      className="h-full"
      value={position}
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      dragRange={dragRange}
      invert
      cursor="auto"
    >
      <div
        ref={baseDivRef}
        className={cz("h-full w-22px relative")}
        style={colorStyles.base}
      >
        <div
          className={cz("h-200px w-full absolute left-0")}
          style={{
            ...colorStyles.track,
            top: `calc(${position * 100}% - ${position * 200}px)`,
          }}
        />
      </div>
    </KnobFrame>
  );
};
