import { cz } from "@lib/utils/cz";
import { seqNumbers, topLimit } from "@lib/utils/number-helper";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { useRef } from "react";
import { appConfig, debugConfig, uiConfig } from "../../definitions/ui-config";
import { useAppContext } from "../../root/app-context";
import {
  EditorCommonLayout,
  PianoRollEditPartPlane,
} from "../common/editor-common-layout";
import {
  diatonicLanesPitchHelper,
  useGridDisplaySpec,
} from "../common/editor-common-logic";
import { getNoteNameLabel } from "../common/note-name-helper";
import { PlayPositionLineLayer } from "../common/play-position-line-layer";
import { useDisplaySpec } from "../common/use-display-spec";
import { DiatonicLanesGrid } from "./diatonic-lanes-grid";
import { NoteLayerRoot } from "../editor-core/note-layer";

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

export const DiatonicLanesEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(measuredDivRef);
  const keysWidth = 100;

  const { store } = useAppContext();
  const { sight, loopBars } = store.useSnapshot();
  const loopSteps = loopBars * 16;
  const displaySteps = topLimit(loopSteps * 2, 32 * 16);
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
    />
  );
};
