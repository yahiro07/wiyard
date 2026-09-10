import { colorMod } from "../utils/color-mod";
import { colorStyle } from "../utils/color-style";
import { cz } from "../utils/cz";
import { KnobFrame } from "./headless/knob-frame";

const colorStyles = {
  base: colorStyle({ bg: colorMod("#404046", "v-2 h220"), bd: "#2c2c2c" }),
  track: colorStyle({
    bg: colorMod("#568", "v-18 s-20 h220"),
    bd: colorMod("#568", "v-10 s-20"),
  }),
};

export const ScrollBarH = ({
  position,
  onChange,
}: {
  position: number;
  onChange: (position: number) => void;
}) => {
  return (
    <KnobFrame
      value={position}
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      horizontal
      dragRange={1200}
    >
      <div className={cz("w-full h-40px relative")} style={colorStyles.base}>
        <div
          className={cz("w-200px h-full absolute top-0")}
          style={{
            ...colorStyles.track,
            left: `calc(${position * 100}% - ${position * 200}px)`,
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
  return (
    <KnobFrame
      className="h-full"
      value={position}
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      dragRange={800}
      invert
    >
      <div className={cz("h-full w-40px relative")} style={colorStyles.base}>
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
