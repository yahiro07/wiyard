import { KnobFrame } from "@/components/knob-frame";

export function NumberSliderBoxView(props: {
  value: number;
  fracDigits?: number;
}) {
  return (
    <div
    // className="w-[50px] h-[32px] flex-c bg-gray-400 text-white border border-gray-600/70"
    // style={{ letterSpacing: "0.03em" }}
    >
      {props.value.toFixed(props.fracDigits ?? 2)}
    </div>
  );
}

export function NumberSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  fracDigits = 0,
  onChange,
  width,
}: {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  fracDigits?: number;
  onChange: (value: number) => void;
  width?: number;
}) {
  return (
    <div className="flex-ha gap-1 relative" style={{ width }}>
      {label && <div className="absolute text-10px -top-2 left-0">{label}</div>}
      <KnobFrame
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        dragRange={400}
      >
        <NumberSliderBoxView value={value} fracDigits={fracDigits} />
      </KnobFrame>
    </div>
  );
}
