import { cz } from "@lib/utils/cz";
import { seqNumbers } from "@lib/utils/number-helper";
import { useState } from "react";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../model/app-context";
import {
  EditorCommonLayout,
  PianoRollEditPartPlane,
} from "../common/editor-common-layout";
import { getPatternPitchLabel } from "../common/editor-common-logic";
import { PositionBar } from "../common/position-bar";
import { useDisplaySpec, useGridDisplaySpec } from "../common/display-specs";
import { NoteLayerRoot } from "../editor-core/note-layer";
import { PatternGrid } from "./pattern-grid";
import { Sight } from "../../definitions/types";
import { Size } from "@lib/utils/common-types";

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

export const PatternEditorView = () => {
  const [mainDivSize, setMainDivSize] = useState<Size | undefined>();
  const keysWidth = 100;
  const sectionDuration = 2 * 16; //fixed for pattern
  const { store } = useAppContext();
  const { sight: originalSight } = store.useSnapshot();

  const sight: Sight = {
    ...originalSight,
    xBarPosition: 0,
    wBars: 2,
  };
  const displaySpec = useDisplaySpec({
    nx: sectionDuration,
    numPitches: uiConfig.numPatternPitches,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    sectionDuration,
    uiConfig.numPatternPitches,
  );

  return (
    <EditorCommonLayout
      mainDivSizeCallback={setMainDivSize}
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
            <PianoRollEditPartPlane displaySpec={displaySpec}>
              <NoteLayerRoot
                displaySpec={displaySpec}
                editorKind="pattern"
                displaySteps={sectionDuration}
                loopSteps={sectionDuration}
              />
            </PianoRollEditPartPlane>
          </div>
        </>
      }
      positionBarContent={
        <PositionBar displaySpec={displaySpec} displaySteps={sectionDuration} />
      }
    />
  );
};
