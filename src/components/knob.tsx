import { mapUnaryTo } from "beams/ax/number-utils";
import { KnobFrame } from "beams/mo-react/components/knob-frame";

export function KnobView(props: { value: number; min: number; max: number }) {
  const vm = {
    tickAngel() {
      const { value, min, max } = props;
      const normValue = (value - min) / (max - min);
      const halfRange = 135;
      const angle = mapUnaryTo(normValue, -halfRange, halfRange);
      return angle;
    },
  };
  return (
    <div className="border-[1.5px] border-[#222] w-[36px] h-[36px] rounded-full bg-[#666]">
      <div
        className="w-full h-full flex justify-center"
        style={{
          transform: `rotate(${vm.tickAngel()}deg)`,
        }}
      >
        <div className="w-[2px] h-[10px] bg-[#fff]" />
      </div>
    </div>
  );
}

export function Knob({
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <KnobFrame
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
    >
      <KnobView value={value} min={min} max={max} />
    </KnobFrame>
  );
}
