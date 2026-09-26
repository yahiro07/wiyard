import { linearInterpolate } from "@lib/utils/number-helper";
import { KnobFrame } from "@lib/components/headless/knob-frame";
import { cz } from "@lib/utils/cz";

export const Knob = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  onTap,
  disabled,
  size = 26,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  onTap?: () => void;
  disabled?: boolean;
  size?: number;
}) => {
  const tickAngle = linearInterpolate(value, min, max, -135, 135);
  return (
    <KnobFrame
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      onTap={onTap}
    >
      <div
        className={cz("rounded-full relative bg-gray-500")}
        style={{ width: size, height: size, opacity: disabled ? 0.5 : 1 }}
      >
        <div
          className="w-full h-full flex-va"
          style={{ transform: `rotate(${tickAngle}deg)` }}
        >
          <div
            className="bg-white"
            style={{
              width: size * 0.1,
              height: size * 0.38,
            }}
          />
        </div>
      </div>
    </KnobFrame>
  );
};
