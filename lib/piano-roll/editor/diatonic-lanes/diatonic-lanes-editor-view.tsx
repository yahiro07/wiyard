import { cz } from "@lib/utils/cz";
import { seqNumbers, topLimit } from "@lib/utils/number-helper";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { useRef } from "react";
import { appConfig, uiConfig } from "../../definitions/ui-config";
import { useAppContext, useStoreAccess } from "../../root/app-context";
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
import { PositionBar } from "../common/position-bar";
import { useDisplaySpec } from "../common/use-display-spec";
import { NoteLayerRoot } from "../editor-core/note-layer";
import { DiatonicLanesGrid } from "./diatonic-lanes-grid";

const PitchIndexColumn = ({ cellH }: { cellH: number }) => {
  const [{ keySpec }] = useStoreAccess();
  return (
    <div className="flex-c h-full">
      <div className="flex-v flex-col-reverse">
        {seqNumbers(uiConfig.numDiatonicLanes).map((i) => {
          const pitch = diatonicLanesPitchHelper.mapYIndexToPitch(i, keySpec);
          const isTonic = pitch % 12 === keySpec.root;
          let label = getNoteNameLabel(pitch, 0);

          if (appConfig.isDevelopment && 1) {
            label = `${i} (${pitch}) ${label ?? ""}`;
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
