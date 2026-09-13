import { useRef } from "react";
import { useDomElementSize } from "../../../utils/use-dom-element-size";
import { appConfig, debugConfig, uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import { cz } from "../../utils/cz";
import { bottomLimit, seqNumbers } from "../../utils/helpers";
import { EditorCommonLayout } from "../common/editor-common-layout";
import {
  diatonicLanesPitchHelper,
  useGridDisplaySpec,
} from "../common/editor-common-logic";
import { DisplaySpec } from "../common/editor-types";
import { RepeatingNoteLayers } from "../common/note-layers";
import { getNoteNameLabel } from "../common/note-name-helper";
import { PlayPositionLineLayer } from "../common/play-position-line-layer";
import { useDisplaySpec } from "../common/use-display-spec";
import { DiatonicLanesGrid } from "./diatonic-lanes-grid";

const PitchIndexColumn = ({ cellH }: { cellH: number }) => {
  return (
    <div className="flex-c h-full">
      <div className="flex-v flex-col-reverse">
        {seqNumbers(uiConfig.numDiatonicLanes).map((i) => {
          const pitch = diatonicLanesPitchHelper.mapYIndexToPitch(i);
          let i2 = i; //C
          if (debugConfig.keyAm) {
            i2 = i + 2; //Am
          }
          const isTonic = i2 % 7 === 0;
          let label: string | undefined;
          if (appConfig.isDevelopment) {
            label = `${i} (${pitch})`;
          } else {
            label = isTonic ? getNoteNameLabel(pitch, 0) : undefined;
          }
          return (
            <div
              key={i}
              className={cz(
                "w-100px flex-c",
                "bd-#333",
                isTonic ? "bg-#568" : "bg-#444",
              )}
              style={{ height: cellH }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
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
        <RepeatingNoteLayers displaySpec={displaySpec} editorKind="mainD" />
        <PlayPositionLineLayer displaySpec={displaySpec} />
      </div>
    </div>
  );
};

export const DiatonicLanesEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(measuredDivRef);
  const keysWidth = 100;

  const { store } = useAppContext();
  const { loopBars, sight } = store.useSnapshot();
  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop
  const numPitches = uiConfig.numDiatonicLanes;

  const displaySpec = useDisplaySpec({
    contentBars,
    numPitches,
    sight,
    mainDivSize,
  });

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    contentBars,
    numPitches,
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
          <DiatonicLanesGrid displaySpec={gridDisplaySpec} />
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
