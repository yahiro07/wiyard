import { linearInterpolate } from "@lib/utils/number-helper";
import { KnobFrame } from "@lib/components/headless/knob-frame";

const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

function getArcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const sweep = endDeg - startDeg;
  if (Math.abs(sweep) < 0.01) return "";
  const start = toRad(startDeg);
  const end = toRad(endDeg);
  const startX = cx + r * Math.cos(start);
  const startY = cy + r * Math.sin(start);
  const endX = cx + r * Math.cos(end);
  const endY = cy + r * Math.sin(end);
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep > 0 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${large} ${sweepFlag} ${endX} ${endY}`;
}

export const ArcKnob = ({
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
  const angleLimit = 155;
  const startAngle = -angleLimit;
  const endAngle = angleLimit;
  const tickAngle = linearInterpolate(value, min, max, startAngle, endAngle);

  const arcRadius = 84;
  const thickness = 24;
  return (
    <KnobFrame
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      onTap={onTap}
    >
      <svg style={{ width: size, height: size }} viewBox="-100 -100 200 200">
        <path
          d={getArcPath(0, 0, arcRadius, startAngle, endAngle)}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          opacity={0.3}
        />
        <path
          d={getArcPath(0, 0, arcRadius, startAngle, tickAngle)}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
        />
      </svg>
    </KnobFrame>
  );
};
