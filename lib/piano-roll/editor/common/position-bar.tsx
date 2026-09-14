import { seqNumbers } from "@lib/utils/number-helper";
import { HorizontalScrollPlane } from "./editor-common-layout";
import { DisplaySpec } from "./editor-types";
import { useStoreAccess } from "../../root/app-context";

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
  const [{ loopGhostEnabled }] = useStoreAccess();

  const { cellW } = displaySpec;
  const stepsPerBar = 16;
  const barCount = displaySteps / stepsPerBar;

  const loopX = loopSteps ?? displaySteps;
  const endX = displaySteps;
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
        <div
          className="absolute top-0 h-4px"
          style={{ width: loopX * cellW - 0.5, background: "#0cf6" }}
        />
        <div
          className="absolute top-0 h-full"
          style={{ left: loopX * cellW - 0.5, width: 1, background: "#0004" }}
        />
        {loopGhostEnabled && (
          <div
            className="absolute top-0 h-4px"
            style={{
              left: loopX * cellW,
              width: (endX - loopX) * cellW,
              background: "#8886",
            }}
          />
        )}
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
            <span className="text-12px mt-4px">{i + 1}</span>
          </div>
        ))}
      </div>
    </HorizontalScrollPlane>
  );
};
