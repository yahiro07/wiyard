import { cz } from "@lib/utils/cz";
import { seqNumbers } from "@lib/utils/number-helper";
import { useRef } from "react";
import { useDomElementSize } from "../../../utils/use-dom-element-size";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import { EditorCommonLayout } from "../common/editor-common-layout";
import {
  getPatternPitchLabel,
  useGridDisplaySpec,
} from "../common/editor-common-logic";
import { useDisplaySpec } from "../common/use-display-spec";
import { PatternGrid } from "./pattern-grid";
import { NoteLayerRoot } from "../editor-core/note-layer";
import { PianoRollEditPartPlane } from "../common/editor-common-layout";

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
  const mainDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(mainDivRef);
  const keysWidth = 100;
  const sectionDuration = 32; //fixed for pattern
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();

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
      mainDivRef={mainDivRef}
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
    />
  );
};
