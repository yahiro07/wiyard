import { useMemo, useRef } from "react";
import { useAppContext } from "../root/app-context";
import { cz } from "../utils/cz";
import { bottomLimit, mapUnaryTo, seqNumbers } from "../utils/helpers";
import { useDomElementSize } from "../utils/use-dom-element-size";
import { EditorCommonLayout } from "./editor-common-layout";
import { PatternGrid, PatternGridDisplaySpec } from "./pattern-grid";

const configs = {
  numPitches: 22,
};

type DisplaySpec = {
  viewW: number;
  viewH: number;
  cellW: number;
  cellH: number;
};

const PitchIndexColumn = ({ cellH }: { cellH: number }) => {
  return (
    <div className="flex-c h-full">
      <div className="flex-v flex-col-reverse">
        {seqNumbers(configs.numPitches).map((i) => (
          <div
            key={i}
            className={cz(
              "w-100px flex-c",
              "bd-#333",
              i % 7 === 0 ? "bg-#568" : "bg-#444",
            )}
            style={{ height: cellH }}
          >
            {i - 7 >= 0 ? i - 7 + 1 : i - 7 - 1}
          </div>
        ))}
      </div>
    </div>
  );
};

const GridBackgroundContainer = ({
  displaySpec,
}: {
  displaySpec: DisplaySpec;
}) => {
  const { store } = useAppContext();
  const { loopBars, sight } = store.useSnapshot();
  const { viewW, viewH, cellW, cellH } = displaySpec;
  const { numPitches } = configs;

  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop
  const nx = contentBars * 16;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
  const contentX1 = contentX0 + viewW;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const contentY0 = sight.yPosition * maxScrollY;
  const contentY1 = contentY0 + viewH;

  const gridDisplaySpec: PatternGridDisplaySpec = useMemo(
    () => ({
      contentW,
      contentH,
      viewW,
      viewH,
      contentX0,
      contentX1,
      contentY0,
      contentY1,
      cellW,
      cellH,
      numStepsFull: nx,
      numPitchesFull: numPitches,
    }),
    [
      contentW,
      contentH,
      viewW,
      viewH,
      contentX0,
      contentX1,
      contentY0,
      contentY1,
      cellW,
      cellH,
      nx,
      // numKeys,
    ],
  );

  return <PatternGrid displaySpec={gridDisplaySpec} />;
};

export const PatternEditorView = () => {
  const { store } = useAppContext();
  const { loopBars, sight } = store.useSnapshot();
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const size = useDomElementSize(measuredDivRef);
  const viewW = size?.width ?? 100;
  const viewH = size?.height ?? 100;

  const displaySpec: DisplaySpec = {
    viewW,
    viewH,
    cellW: mapUnaryTo(sight.xZoom, 20, 80),
    cellH: mapUnaryTo(sight.yZoom, 20, 60),
  };
  const keysWidth = 100;
  const contentH = displaySpec.cellH * configs.numPitches;
  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const ty = -sight.yPosition * maxScrollY;

  return (
    <EditorCommonLayout
      measuredDivRef={measuredDivRef}
      sideContent={
        <div style={{ transform: `translateY(${ty}px)` }}>
          <PitchIndexColumn cellH={displaySpec.cellH} />
        </div>
      }
      sideContentWidth={keysWidth}
      mainContent={
        <>
          <GridBackgroundContainer displaySpec={displaySpec} />
          <div
            className="absolute-full"
            style={{ transform: `translateY(${ty}px)` }}
          >
            {/* <PianoRollEditPart displaySpec={displaySpec} /> */}
          </div>
        </>
      }
    />
  );
};
