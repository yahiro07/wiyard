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
      <div className="bg-#555 h-full text-#222">
        {seqNumbers(barCount).map((i) => (
          <div
            key={i}
            className="absolute top-0 h-full border-l border-#222"
            style={{
              left: i * stepsPerBar * cellW,
              width: stepsPerBar * cellW,
            }}
          >
            <span className="pl-1 text-10px">{i + 1}</span>
          </div>
        ))}
        {/* {loopSteps !== undefined && loopSteps < displaySteps && (
          <div
            className="absolute top-0 h-full border-l border-#888"
            style={{ left: loopSteps * cellW }}
          />
        )} */}
      </div>
    </HorizontalScrollPlane>
  );
};
