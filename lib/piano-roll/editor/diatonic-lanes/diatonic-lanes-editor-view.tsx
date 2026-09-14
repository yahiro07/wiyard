import { topLimit } from "@lib/utils/number-helper";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { useRef } from "react";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import {
  EditorCommonLayout,
  PianoRollEditPartPlane,
} from "../common/editor-common-layout";
import { useGridDisplaySpec } from "../common/editor-common-logic";
import { PlayPositionLineLayer } from "../common/play-position-line-layer";
import { PositionBar } from "../common/position-bar";
import { useDisplaySpec } from "../common/use-display-spec";
import { NoteLayerRoot } from "../editor-core/note-layer";
import { DiatonicLanesGrid } from "./diatonic-lanes-grid";
import { DiatonicPitchIndexColumn } from "./diatonic-pitch-index-column";

export const DiatonicLanesEditorView = () => {
  const mainDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(mainDivRef);
  const keysWidth = 100;

  const { store } = useAppContext();
  const { sight, loopBars, keySpec } = store.useSnapshot();
  const loopSteps = loopBars * 16;
  const displaySteps = topLimit(loopSteps * 2, 16 * 16);
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
      mainDivRef={mainDivRef}
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
