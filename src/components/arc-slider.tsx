import { KnobFrame } from "@lib/components/headless/knob-frame";
import { linearInterpolate } from "@lib/utils/number-helper";

export const ArcSliderH = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  onTap,
  color,
  size = 40,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  onTap?: () => void;
  color: string;
  size?: number;
}) => {
  const usz = size / 6;
  const tickLeft = linearInterpolate(value, min, max, 0, size - usz);
  return (
    <KnobFrame
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      onTap={onTap}
      horizontal
      dragRange={size}
    >
      <div className="flex-c" style={{ height: usz * 3.5 }}>
        <div style={{ width: size, height: usz }} className="relative">
          <div
            className="absolute-full"
            style={{
              background: color,
              opacity: 0.3,
            }}
          />
          <div
            className="absolute"
            style={{
              left: tickLeft,
              width: usz,
              height: usz,
              background: color,
            }}
          />
        </div>
      </div>
    </KnobFrame>
  );
};
