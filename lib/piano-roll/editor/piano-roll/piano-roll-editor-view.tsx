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
import { PianoRollGrid } from "./piano-roll-grid";
import { SideKeyboardColumn } from "./side-keyboard-column";
import { Size } from "@lib/utils/common-types";

export const PianoRollEditorView = () => {
  const [mainDivSize, setMainDivSize] = useState<Size | undefined>();
  const keysWidth = 100;

  const { store } = useAppContext();
  const { sight: originalSight, loopBars } = store.useSnapshot();
  const sight = fixSightWithLeftPadding(originalSight);
  const loopSteps = loopBars * 16;
  // const displayBars = clampValue(loopBars * 2, 2, 16);
  const displayBars = 16;
  const displaySteps = displayBars * 16;

  const displaySpec = useDisplaySpec({
    nx: displaySteps,
    numPitches: uiConfig.numKeys,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    displaySteps,
    uiConfig.numKeys,
    sight,
  );
  return (
    <EditorCommonLayout
      mainDivSizeCallback={setMainDivSize}
      sideContent={
        <div style={{ transform: `translateY(${displaySpec.ty}px)` }}>
          <SideKeyboardColumn cellH={displaySpec.cellH} width={keysWidth} />
        </div>
      }
      sideContentWidth={keysWidth}
      mainContent={
        <>
          <PianoRollGrid displaySpec={gridDisplaySpec} />
          <div
            className="absolute-full"
            style={{ transform: `translateY(${displaySpec.ty}px)` }}
          >
            <PianoRollEditPartPlane displaySpec={displaySpec}>
              <NoteLayerRoot
                displaySpec={displaySpec}
                editorKind="main"
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
