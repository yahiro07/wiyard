import { ReactPointerEvent } from "@lib/utils/dom-helper";
import { startDragSession } from "@lib/utils/drag-session";
import { clampValue } from "@lib/utils/number-helper";

type Props = {
  xValue: number;
  xMin: number;
  xMax: number;
  xStep: number;
  yValue: number;
  yMin: number;
  yMax: number;
  yStep: number;
  xTickRate: number;
  yTickRate: number;
  onXYChange: (x: number, y: number) => void;
};

function calcNewValue(
  originalValue: number,
  moveAmount: number,
  dragRange: number,
  min: number,
  max: number,
  step: number,
) {
  const delta = moveAmount / (dragRange / (max - min));
  let newXValue = originalValue + delta;
  if (step > 0) {
    newXValue = Math.round(newXValue / step) * step;
  }
  return clampValue(newXValue, min, max);
}

export const XYZoomPad = ({
  xValue,
  xMin,
  xMax,
  xStep,
  yValue,
  yMin,
  yMax,
  yStep,
  xTickRate,
  yTickRate,
  onXYChange,
}: Props) => {
  const handlePointerDown = (e0: ReactPointerEvent) => {
    const dragRangeX = 150;
    const dragRangeY = 100;
    const original = { xValue, yValue };

    let direction: "horizontal" | "vertical" | undefined;

    startDragSession(e0, {
      onMove(_, moveAmount) {
        if (!direction) {
          const th = 8;
          const dx = Math.abs(moveAmount.x);
          const dy = Math.abs(moveAmount.y);
          if (dx > th) direction = "horizontal";
          else if (dy > th) direction = "vertical";
        }

        if (direction === "horizontal") {
          const newXValue = calcNewValue(
            original.xValue,
            moveAmount.x,
            dragRangeX,
            xMin,
            xMax,
            xStep,
          );
          onXYChange(newXValue, original.yValue);
        } else if (direction === "vertical") {
          const newYValue = calcNewValue(
            original.yValue,
            -moveAmount.y,
            dragRangeY,
            yMin,
            yMax,
            yStep,
          );
          onXYChange(original.xValue, newYValue);
        }
      },
    });
  };

  const innerSC = 0.7;
  return (
    <div
      className="w-32px h-32px bg-#888 flex-c cursor-pointer"
      onPointerDown={handlePointerDown}
    >
      <div
        className="bd-#fff border-1.5px"
        style={{
          width: `${xTickRate * 100 * innerSC}%`,
          height: `${yTickRate * 100 * innerSC}%`,
        }}
      />
    </div>
  );
};
