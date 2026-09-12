import { ReactNode } from "react";
import { startDragSessionEx } from "../../../utils/drag-session";
import { clampValue } from "../../utils/helpers";

type Props = {
  className?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  children: ReactNode;
  onChange: (value: number) => void;
  dragRange?: number;
  onClick?: () => void;
  horizontal?: boolean;
  invert?: boolean;
};

export function KnobFrame({
  className,
  value,
  min,
  max,
  step,
  children,
  onChange,
  dragRange = 100,
  onClick,
  horizontal,
  invert,
}: Props) {
  const handlePointerDown = (e0: React.PointerEvent) => {
    const originalValue = value;

    startDragSessionEx(e0.nativeEvent, {
      onMove(_, moveAmount) {
        let delta =
          (horizontal ? moveAmount.x : -moveAmount.y) /
          (dragRange / (max - min));
        if (invert) {
          delta *= -1;
        }
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
    <div
      onPointerDown={handlePointerDown}
      className={className}
      style={{ cursor: "pointer" }}
    >
      {children}
    </div>
  );
}
