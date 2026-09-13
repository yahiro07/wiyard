import { useRef } from "react";
import { useDomElementSize } from "../../../utils/use-dom-element-size";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import { cz } from "../../utils/cz";
import { seqNumbers } from "../../utils/helpers";
import { EditorCommonLayout } from "../common/editor-common-layout";
import {
  getPatternPitchLabel,
  useGridDisplaySpec,
} from "../common/editor-common-logic";
import { DisplaySpec } from "../common/editor-types";
import { RepeatingNoteLayers } from "../common/note-layers";
import { useDisplaySpec } from "../common/use-display-spec";
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
            {getPatternPitchLabel(i)}
          </div>
        ))}
      </div>
    </div>
  );
};

const PatternPianoRollEditPart = ({
  displaySpec,
}: {
  displaySpec: DisplaySpec;
}) => {
  const { contentW, contentH, tx } = displaySpec;
  return (
    <div className={cz("overflow-hidden")}>
      <div
        className="relative flex-h"
        style={{
          width: contentW,
          height: contentH,
          transform: `translateX(${tx}px)`,
        }}
      >
        <RepeatingNoteLayers displaySpec={displaySpec} editorKind="pattern" />
      </div>
    </div>
  );
};

export const PatternEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(measuredDivRef);
  const keysWidth = 100;
  const contentBars = 2; //fixed for pattern
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();

  const displaySpec = useDisplaySpec({
    contentBars,
    numPitches: uiConfig.numPatternPitches,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    contentBars,
    uiConfig.numPatternPitches,
  );

  return (
    <EditorCommonLayout
      measuredDivRef={measuredDivRef}
      sideContent={
        <div style={{ transform: `translateY(${displaySpec.ty}px)` }}>
          <PitchIndexColumn cellH={displaySpec.cellH} />
        </div>
      }
      sideContentWidth={keysWidth}
      mainContent={
        <>
          <PatternGrid displaySpec={gridDisplaySpec} />
          <div
            className="absolute-full"
            style={{ transform: `translateY(${displaySpec.ty}px)` }}
          >
            <PatternPianoRollEditPart displaySpec={displaySpec} />
          </div>
        </>
      }
    />
  );
};
