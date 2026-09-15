import { linearInterpolate } from "@lib/utils/number-helper";
import { KnobFrame } from "@/components/knob-frame";

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
    >
      <div
        className="w-28px h-28px rounded-full relative bg-gray-500"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <div
          className="w-full h-full flex-va"
          style={{ transform: `rotate(${tickAngle}deg)` }}
        >
          <div className="w-2.5px h-9px bg-white" />
        </div>
      </div>
    </KnobFrame>
  );
};
