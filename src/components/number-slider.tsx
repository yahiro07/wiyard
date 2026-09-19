import { KnobFrame } from "@lib/components/headless/knob-frame";

export function NumberSliderBoxView(props: {
  value: number;
  fracDigits?: number;
}) {
  return (
    <div
      className="w-50px h-28px flex-c bg-gray-500 text-white"
      style={{ letterSpacing: "0.05em" }}
    >
      {props.value.toFixed(props.fracDigits ?? 2)}
    </div>
  );
}

export function NumberSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  fracDigits = 0,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  fracDigits?: number;
  onChange: (value: number) => void;
}) {
  return (
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
  );
}
