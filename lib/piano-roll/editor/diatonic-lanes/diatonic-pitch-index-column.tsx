import { cz } from "@lib/utils/cz";
import { startDragSession } from "@lib/utils/drag-session";
import { seqNumbers } from "@lib/utils/number-helper";
import { useState } from "react";
import { SongKeySpec } from "wafer-host/unit-types";
import { appConfig, uiConfig } from "../../definitions/ui-config";
import { useStoreAccess } from "../../root/app-context";
import { diatonicLanesPitchHelper } from "../common/editor-common-logic";
import { getNoteNameLabel } from "../common/note-name-helper";

const PitchCell = ({
  i,
  cellH,
  keySpec,
  octaveShift,
  setPreviewNotePitch,
  liveInputNoteNumbers,
}: {
  i: number;
  cellH: number;
  keySpec: SongKeySpec;
  octaveShift: number;
  setPreviewNotePitch: (pitch: number | null) => void;
  liveInputNoteNumbers: number[];
}) => {
  const pitch = diatonicLanesPitchHelper.mapYIndexToPitch(i, keySpec);
  const isTonic = pitch % 12 === (keySpec.root + 12) % 12;

  const noteNumber = 24 + pitch;
  const extPressed = liveInputNoteNumbers.includes(noteNumber);

  let label: string | undefined;
  if (isTonic) {
    label = getNoteNameLabel(pitch, octaveShift);
  }
  if (1) {
    label = getNoteNameLabel(pitch, octaveShift);
  }
  if (appConfig.isDevelopment && 0) {
    label = `${i} (${pitch}) ${label ?? ""}`;
  }

  const [pressed, setPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setPressed(true);
    setPreviewNotePitch(pitch);
    startDragSession(e.nativeEvent, {
      onEnd() {
        setPressed(false);
        setPreviewNotePitch(null);
      },
    });
  };

  return (
    <div
      key={i}
      className={cz(
        "w-100px flex-c cursor-pointer",
        "bd-#333",
        isTonic ? "bg-#568" : "bg-#444",
        (pressed || extPressed) && "!bg-#4dd",
      )}
      style={{ height: cellH }}
      onPointerDown={handlePointerDown}
    >
      {label}
    </div>
  );
};

export const DiatonicPitchIndexColumn = ({ cellH }: { cellH: number }) => {
  const [{ keySpec, octaveShift, liveInputNoteNumbers }, mt] = useStoreAccess();
  return (
    <div className="flex-c h-full">
      <div className="flex-v flex-col-reverse">
        {seqNumbers(uiConfig.numDiatonicLanes).map((i) => (
          <PitchCell
            key={i}
            i={i}
            cellH={cellH}
            keySpec={keySpec}
            octaveShift={octaveShift}
            setPreviewNotePitch={mt.setPreviewNotePitch}
            liveInputNoteNumbers={liveInputNoteNumbers}
          />
        ))}
      </div>
    </div>
  );
};
