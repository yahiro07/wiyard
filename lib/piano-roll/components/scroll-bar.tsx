import { KnobFrame } from "./headless/knob-frame";

export const ScrollBarH = ({
  position,
  onChange,
}: {
  position: number;
  onChange: (position: number) => void;
}) => {
  return (
    <KnobFrame
      value={position}
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      horizontal
      dragRange={1200}
    >
      <div className="w-full h-40px bg-#888 relative">
        <div
          className="w-200px h-full absolute bd-red-500 top-0"
          style={{ left: `calc(${position * 100}% - ${position * 200}px)` }}
        />
      </div>
    </KnobFrame>
  );
};

export const ScrollBarV = ({
  position,
  onChange,
}: {
  position: number;
  onChange: (position: number) => void;
}) => {
  return (
    <KnobFrame
      className="h-full"
      value={position}
      onChange={onChange}
      min={0}
      max={1}
      step={0.01}
      dragRange={800}
      invert
    >
      <div className="h-full w-40px bg-#888 relative">
        <div
          className="h-200px w-full absolute bd-red-500 left-0"
          style={{ top: `calc(${position * 100}% - ${position * 200}px)` }}
        />
      </div>
    </KnobFrame>
  );
};
