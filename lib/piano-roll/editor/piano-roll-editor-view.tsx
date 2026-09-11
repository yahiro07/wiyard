import { useRef } from "react";
import { uiConfig } from "../definitions/ui-config";
import { useAppContext } from "../root/app-context";
import { cz } from "../utils/cz";
import { bottomLimit, mapUnaryTo } from "../utils/helpers";
import { useDomElementSize } from "../utils/use-dom-element-size";
import { RepeatingNoteLayers, useGridDisplaySpec } from "./editor-common";
import { EditorCommonLayout } from "./editor-common-layout";
import { DisplaySpec } from "./editor-types";
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
  const { store } = useAppContext();
  const { loopBars, sight } = store.useSnapshot();
  const { numKeys } = uiConfig;
  const { viewW, cellW, cellH } = displaySpec;

  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop
  const nx = contentBars * 16;
  const contentW = cellW * nx;
  const contentH = cellH * numKeys;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
  const left = -contentX0;

  return (
    <div className={cz("overflow-hidden")}>
      <div
        className="relative flex-h"
        style={{
          width: contentW,
          height: contentH,
          transform: `translateX(${left}px)`,
        }}
      >
        <RepeatingNoteLayers displaySpec={displaySpec} noteKind="mapped" />
        <RepeatingNoteLayers displaySpec={displaySpec} noteKind="input" />
        <PlayPositionLineLayer displaySpec={displaySpec} />
      </div>
    </div>
  );
};

const GridBackgroundContainer = ({
  displaySpec,
}: {
  displaySpec: DisplaySpec;
}) => {
  const { store } = useAppContext();
  const { loopBars } = store.useSnapshot();
  const { numKeys: numPitches } = uiConfig;
  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    contentBars,
    numPitches,
  );
  return <PianoRollGrid displaySpec={gridDisplaySpec} />;
};

export const PianoRollEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const { numKeys } = uiConfig;

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

  const contentH = displaySpec.cellH * numKeys;
  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const ty = -sight.yPosition * maxScrollY;

  return (
    <EditorCommonLayout
      measuredDivRef={measuredDivRef}
      sideContent={
        <div style={{ transform: `translateY(${ty}px)` }}>
          <SideKeyboardColumn cellH={displaySpec.cellH} width={keysWidth} />
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
            <PianoRollEditPart displaySpec={displaySpec} />
          </div>
        </>
      }
    />
  );
};
