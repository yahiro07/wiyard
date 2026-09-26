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
  smaller,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  onTap?: () => void;
  disabled?: boolean;
  smaller?: boolean;
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
        className={cz(
          "rounded-full relative bg-gray-500",
          !smaller ? "w-26px h-26px" : "w-23px h-23px",
        )}
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
