import { useRef } from "react";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import { cz } from "../../utils/cz";
import { bottomLimit } from "../../utils/helpers";
import { useDomElementSize } from "../../utils/use-dom-element-size";
import { EditorCommonLayout } from "../common/editor-common-layout";
import { useGridDisplaySpec } from "../common/editor-common-logic";
import { DisplaySpec } from "../common/editor-types";
import { RepeatingNoteLayers } from "../common/note-layers";
import { useDisplaySpec } from "../common/use-display-spec";
import { PianoRollGrid } from "./piano-roll-grid";
import { SideKeyboardColumn } from "./side-keyboard-column";

const PlayPositionLineLayer = ({
  displaySpec,
}: {
  displaySpec: DisplaySpec;
}) => {
  const { store } = useAppContext();
  const { cellW } = displaySpec;
  const { playPos } = store.useSnapshot();
  if (playPos === null) return;
  const barW = cellW * 1.5;
  const localPos = playPos % 32;

  return (
    <div
      className={stylePlayPositionLineLayer.base}
      style={{ left: localPos * cellW - barW, width: barW }}
    />
  );
};
const stylePlayPositionLineLayer = {
  base: cz(
    "absolute top-0 pointer-events-none h-full",
    "border-r border-solid border-#0ff4 bg-[linear-gradient(to_right,#0cc0,#0ff3)]",
  ),
};

const PianoRollEditPart = ({ displaySpec }: { displaySpec: DisplaySpec }) => {
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
        <RepeatingNoteLayers displaySpec={displaySpec} editorKind="main" />
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
  const { loopBars, sight } = store.useSnapshot();
  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop

  const displaySpec = useDisplaySpec({
    contentBars,
    numPitches: uiConfig.numKeys,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    contentBars,
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
            <PianoRollEditPart displaySpec={displaySpec} />
          </div>
        </>
      }
    />
  );
};
