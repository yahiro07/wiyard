import { useRef } from "react";
import { useDomElementSize } from "../../../utils/use-dom-element-size";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import {
  EditorCommonLayout,
  PianoRollEditPartPlane,
} from "../common/editor-common-layout";
import { useGridDisplaySpec } from "../common/editor-common-logic";
import { PlayPositionLineLayer } from "../common/play-position-line-layer";
import { useDisplaySpec } from "../common/use-display-spec";
import { PianoRollGrid } from "./piano-roll-grid";
import { SideKeyboardColumn } from "./side-keyboard-column";
import { NoteLayerRoot } from "../editor-core/note-layer";
import { clampValue } from "@lib/utils/number-helper";
import { PositionBar } from "../common/position-bar";

export const PianoRollEditorView = () => {
  const mainDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(mainDivRef);
  const keysWidth = 100;

  const { store } = useAppContext();
  const { sight, loopBars } = store.useSnapshot();
  const loopSteps = loopBars * 16;
  const displayBars = clampValue(loopBars * 2, 2, 32);
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
  );
  return (
    <EditorCommonLayout
      mainDivRef={mainDivRef}
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
