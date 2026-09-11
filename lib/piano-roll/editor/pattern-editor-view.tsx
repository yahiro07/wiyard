import { useRef } from "react";
import { uiConfig } from "../definitions/ui-config";
import { useAppContext } from "../root/app-context";
import { cz } from "../utils/cz";
import { bottomLimit, mapUnaryTo, seqNumbers } from "../utils/helpers";
import { useDomElementSize } from "../utils/use-dom-element-size";
import { useGridDisplaySpec } from "./editor-common";
import { EditorCommonLayout } from "./editor-common-layout";
import { DisplaySpec } from "./editor-types";
import { PatternGrid } from "./pattern-grid";

const PitchIndexColumn = ({ cellH }: { cellH: number }) => {
  return (
    <div className="flex-c h-full">
      <div className="flex-v flex-col-reverse">
        {seqNumbers(uiConfig.numPatternPitches).map((i) => (
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
  const contentBars = 2; //fixed for pattern
  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    contentBars,
    uiConfig.numPatternPitches,
  );
  return <PatternGrid displaySpec={gridDisplaySpec} />;
};

export const PatternEditorView = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
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
  const contentH = displaySpec.cellH * uiConfig.numPatternPitches;
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
