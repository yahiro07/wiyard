import { clampValue, seqNumbers } from "@lib/utils/number-helper";
import { useCallback } from "react";
import { LoopBarLength } from "../../definitions/types";
import { useAppContext, useStoreAccess } from "../../root/app-context";
import { HorizontalScrollPlane } from "./editor-common-layout";
import { DisplaySpec } from "./editor-types";

type PositionBarProps = {
  displaySpec: DisplaySpec;
  displaySteps: number;
  loopSteps?: number;
};

function usePositionBarPointerHandler(displaySteps: number) {
  const { store } = useAppContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  return useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const xiFloat = ((e.clientX - rect.left) / rect.width) * displaySteps;
      const nextLoopBars = clampValue(
        (1 << Math.ceil(Math.log2(Math.floor(xiFloat / 4) + 1))) * 0.25,
        0.25,
        16,
      ) as LoopBarLength;
      if (nextLoopBars !== store.state.loopBars) {
        store.setLoopBars(nextLoopBars);
      }
    },
    [displaySteps],
  );
}

const BarMarker = ({ index, cellW }: { index: number; cellW: number }) => {
  return (
    <div
      className="absolute top-0 h-full flex-ha pl-5px"
      style={{
        left: index * 16 * cellW,
        width: 16 * cellW,
        borderLeft: index !== 0 ? `solid 1px #0008` : undefined,
      }}
    >
      <span className="text-12px mt-4px">{index + 1}</span>
    </div>
  );
};

const SectionHighlighters = ({
  loopX,
  endX,
  cellW,
  loopGhostEnabled,
}: {
  loopX: number;
  endX: number;
  cellW: number;
  loopGhostEnabled: boolean;
}) => {
  return (
    <>
      <div
        className="absolute top-0 h-4px bg-#0cf6"
        style={{ width: loopX * cellW - 0.5 }}
      />
      <div
        className="absolute top-0 h-full bg-#0004"
        style={{ left: loopX * cellW - 0.5, width: 1 }}
      />
      {loopGhostEnabled && (
        <div
          className="absolute top-0 h-4px bg-#8886"
          style={{
            left: loopX * cellW,
            width: (endX - loopX) * cellW,
          }}
        />
      )}
    </>
  );
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
  const handlePointerDown = usePositionBarPointerHandler(displaySteps);

  return (
    <div className="bg-#282828">
      <HorizontalScrollPlane displaySpec={displaySpec}>
        <div
          className="h-24px bg-#333 text-#888 bd-#0004"
          onPointerDown={handlePointerDown}
        >
          <SectionHighlighters
            loopX={loopX}
            endX={endX}
            cellW={cellW}
            loopGhostEnabled={loopGhostEnabled}
          />
          {seqNumbers(barCount).map((i) => (
            <BarMarker key={i} index={i} cellW={cellW} />
          ))}
        </div>
      </HorizontalScrollPlane>
    </div>
  );
};
