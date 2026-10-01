import { useState } from "react";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../model/app-context";
import {
  EditorCommonLayout,
  PianoRollEditPartPlane,
} from "../common/editor-common-layout";
import { PlayPositionLineLayer } from "../common/play-position-line-layer";
import { PositionBar } from "../common/position-bar";
import {
  fixSightWithLeftPadding,
  useDisplaySpec,
  useGridDisplaySpec,
} from "../common/display-specs";
import { NoteLayerRoot } from "../editor-core/note-layer";
import { DiatonicLanesGrid } from "./diatonic-lanes-grid";
import { DiatonicPitchIndexColumn } from "./diatonic-pitch-index-column";
import { Size } from "@lib/utils/common-types";

export const DiatonicLanesEditorView = () => {
  const [mainDivSize, setMainDivSize] = useState<Size | undefined>();
  const keysWidth = 100;

  const { store } = useAppContext();
  const { sight: originalSight, loopBars, keySpec } = store.useSnapshot();
  const sight = fixSightWithLeftPadding(originalSight);
  const loopSteps = loopBars * 16;
  // const displaySteps = topLimit(loopSteps * 2, 16 * 16);
  const displaySteps = 256;

  const numPitches = uiConfig.numDiatonicLanes;

  const displaySpec = useDisplaySpec({
    nx: displaySteps,
    numPitches,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    displaySteps,
    numPitches,
    keySpec,
  );
  return (
    <EditorCommonLayout
      mainDivSizeCallback={setMainDivSize}
      sideContent={
        <div style={{ transform: `translateY(${displaySpec.ty}px)` }}>
          <DiatonicPitchIndexColumn cellH={displaySpec.cellH} />
        </div>
      }
      sideContentWidth={keysWidth}
      mainContent={
        <>
          <DiatonicLanesGrid displaySpec={gridDisplaySpec} />
          <div
            className="absolute-full"
            style={{ transform: `translateY(${displaySpec.ty}px)` }}
          >
            <PianoRollEditPartPlane displaySpec={displaySpec}>
              <NoteLayerRoot
                displaySpec={displaySpec}
                editorKind="mainD"
                displaySteps={displaySteps}
                loopSteps={loopSteps}
              />
              <PlayPositionLineLayer displaySpec={displaySpec} />
            </PianoRollEditPartPlane>
          </div>
        </>
      }
      positionBarContent={
        <PositionBar
          displaySpec={displaySpec}
          displaySteps={displaySteps}
          loopSteps={loopSteps}
        />
      }
    />
  );
};
