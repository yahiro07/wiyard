import { startDragSessionEx } from "@lib/utils/drag-session";
import { clampValue } from "@lib/utils/number-helper";
import { ReactNode } from "react";

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  children: ReactNode;
  onChange: (value: number) => void;
  dragRange?: number;
  onClick?: () => void;
};

export function KnobFrame({
  value,
  min,
  max,
  step,
  children,
  onChange,
  dragRange = 100,
  onClick,
}: Props) {
  const handlePointerDown = (e0: React.PointerEvent) => {
    const originalValue = value;

    startDragSessionEx(e0.nativeEvent, {
      onMove(_, moveAmount) {
        const delta = -moveAmount.y / (dragRange / (max - min));
        let newValue = originalValue + delta;
        if (step > 0) {
          newValue = Math.round(newValue / step) * step;
        }
        newValue = clampValue(newValue, min, max);
        onChange(newValue);
      },
      onTap() {
        onClick?.();
      },
    });
  };
  return (
    <div onPointerDown={handlePointerDown} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}
