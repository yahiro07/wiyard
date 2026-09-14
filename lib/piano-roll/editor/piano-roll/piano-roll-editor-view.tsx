import { cz } from "@lib/utils/cz";
import { useRef } from "react";
import { useDomElementSize } from "../../../utils/use-dom-element-size";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import { EditorCommonLayout } from "../common/editor-common-layout";
import { useGridDisplaySpec } from "../common/editor-common-logic";
import { DisplaySpec } from "../common/editor-types";
import { PlayPositionLineLayer } from "../common/play-position-line-layer";
import { useDisplaySpec } from "../common/use-display-spec";
import { PianoRollGrid } from "./piano-roll-grid";
import { SideKeyboardColumn } from "./side-keyboard-column";
import { NoteLayerRoot } from "../editor-core/note-layer";

const PianoRollEditPart = ({
  displaySpec,
  sectionDuration,
}: {
  displaySpec: DisplaySpec;
  sectionDuration: number;
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
        <NoteLayerRoot
          displaySpec={displaySpec}
          editorKind="main"
          sectionDuration={sectionDuration}
        />
        <PlayPositionLineLayer displaySpec={displaySpec} />
      </div>
    </div>
  );
};

export const PianoRollEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(measuredDivRef);
  const keysWidth = 100;

  const { store } = useAppContext();
  const { sight, loopBars } = store.useSnapshot();
  const sectionDuration = loopBars * 16;

  const displaySpec = useDisplaySpec({
    sectionDuration,
    numPitches: uiConfig.numKeys,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    sectionDuration,
    uiConfig.numKeys,
  );
  return (
    <EditorCommonLayout
      measuredDivRef={measuredDivRef}
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
            <PianoRollEditPart
              displaySpec={displaySpec}
              sectionDuration={sectionDuration}
            />
          </div>
        </>
      }
    />
  );
};
