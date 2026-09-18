import { linearInterpolate } from "@lib/utils/number-helper";
import { KnobFrame } from "@lib/components/headless/knob-frame";
import { cz } from "@lib/utils/cz";

export const Knob = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) => {
  const tickAngle = linearInterpolate(value, min, max, -135, 135);
  return (
    <KnobFrame
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
    >
      <div className={styles}>
        <div className="inner"></div>
        <div
          className="tick-plane"
          style={{ transform: `rotate(${tickAngle}deg)` }}
        >
          <div className="tick" />
        </div>
      </div>
    </KnobFrame>
  );
};
const styles = cz(
  "relative rounded-full w-60px h-60px p-5px border-solid border-0.5 border-#666",
  "hover:opacity-80",
  "[&>.inner]:(w-full h-full rounded-full bg-#eee)",
  "[&>.tick-plane]:(absolute-full flex-va)",
  "[&>.tick-plane>.tick]:(w-3.5px h-16px bg-#999)",
);
