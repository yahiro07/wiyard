import { linearInterpolate } from "@lib/utils/number-helper";
import { KnobFrame } from "@lib/components/headless/knob-frame";

export const Knob = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  onClick,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const tickAngle = linearInterpolate(value, min, max, -135, 135);
  return (
    <KnobFrame
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      onClick={onClick}
      // dragDisabled={disabled}
    >
      <div
        className="w-30px h-30px rounded-full relative bg-#888"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <div
          className="w-full h-full flex-va"
          style={{ transform: `rotate(${tickAngle}deg)` }}
        >
          <div className="w-2px h-10px bg-white" />
        </div>
      </div>
    </KnobFrame>
  );
};
