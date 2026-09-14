import { seqNumbers } from "@lib/utils/number-helper";
import { HorizontalScrollPlane } from "./editor-common-layout";
import { DisplaySpec } from "./editor-types";

type PositionBarProps = {
  displaySpec: DisplaySpec;
  displaySteps: number;
  loopSteps?: number;
};

export const PositionBar = ({
  displaySpec,
  displaySteps,
  loopSteps,
}: PositionBarProps) => {
  const { cellW } = displaySpec;
  const stepsPerBar = 16;
  const barCount = displaySteps / stepsPerBar;
  return (
    <HorizontalScrollPlane displaySpec={displaySpec}>
      <div
        className="h-20px"
        style={{
          background: "#333",
          color: "#888",
          border: "solid 1px #0002",
        }}
      >
        {seqNumbers(barCount).map((i) => (
          <div
            key={i}
            className="absolute top-0 h-full flex-ha pl-5px"
            style={{
              left: i * stepsPerBar * cellW,
              width: stepsPerBar * cellW,
              borderLeft: `solid 1px #0008`,
            }}
          >
            <span className="text-12px">{i + 1}</span>
          </div>
        ))}
        {loopSteps !== undefined && loopSteps < displaySteps && (
          <div
            className="absolute top-0 h-full"
            style={{ left: loopSteps * cellW, borderLeft: `solid 1px #ddd` }}
          />
        )}
      </div>
    </HorizontalScrollPlane>
  );
};
