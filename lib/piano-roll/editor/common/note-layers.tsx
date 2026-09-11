import { useMemo } from "react";
import { EditorKind, Note, NoteKind } from "../../definitions/types";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext, useStoreAccess } from "../../root/app-context";
import { colorStyle } from "../../utils/color-style";
import { cz } from "../../utils/cz";
import { mapUnaryTo, seqNumbers } from "../../utils/helpers";
import { EditInputLayer } from "./edit-input-layer";
import {
  diatonicLanesPitchHelper,
  getPatternPitchLabel,
  getSectionStride,
} from "./editor-common-logic";
import { DisplaySpec, SectionRange } from "./editor-types";
import { getNoteNameLabel } from "./note-name-helper";

const noteColors = {
  input: "#6cc",
  pattern: "#bd8",
  mapped: "#6cc",
};

const NoteView = ({
  note,
  sectionRange,
  displaySpec,
  editorKind,
  patternEnabled,
  octaveShift,
  duty: inputDuty,
}: {
  note: Note;
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
  patternEnabled: boolean;
  octaveShift: number;
  duty: number;
}) => {
  const { cellW, cellH } = displaySpec;
  const pos = note.position - sectionRange.offset;
  const yi0 = note.pitch;
  let yi = note.pitch;
  if (editorKind === "mainD") {
    yi = diatonicLanesPitchHelper.mapPitchToDisplayYIndex(note.pitch);
  }
  const isPattern = editorKind === "pattern";
  let noteKind: NoteKind = "input";
  if (isPattern) {
    noteKind = "pattern";
  } else if (note.parentNoteId !== undefined) {
    noteKind = "mapped";
  }
  let bgColor = noteColors[noteKind];
  let borderColor = "#0006";
  if (patternEnabled) {
    if (noteKind === "input") {
      bgColor = "#6cc1";
      borderColor = "#6cc6";
    }
  }
  const dur = note.duration;
  let duty = 1;
  if (0) {
    if (
      (!patternEnabled && noteKind === "input") ||
      (patternEnabled && noteKind === "mapped")
    ) {
      duty = inputDuty;
    }
  }
  const dutyM = mapUnaryTo(duty, 0.2, 1);
  const cutoutPercent = (1 - dutyM) * 100;

  return (
    <div
      className={styleNoteView.base}
      style={{
        left: pos * cellW,
        bottom: yi * cellH,
        width: cellW * dur - 0.5,
        height: cellH,
      }}
    >
      <div
        className={cz(styleNoteView.inner)}
        style={{
          height: cellH - 2,
          ...colorStyle({ bg: bgColor, bd: borderColor }),
        }}
      >
        {isPattern
          ? getPatternPitchLabel(yi0)
          : getNoteNameLabel(yi0, octaveShift)}
        {cutoutPercent > 0 && (
          <div
            className={cz(styleNoteView.cutout)}
            style={{ width: `${cutoutPercent}%` }}
          />
        )}
      </div>
    </div>
  );
};
const styleNoteView = {
  base: "absolute flex-c cursor-pointer",
  inner: cz(
    "w-full flex-ha rounded-2px pl-0.5 text-#0008 text-10px font-monospace",
    "relative",
  ),
  cutout: "absolute top-0 right-0 bg-black/15 h-full",
};

const NotesDisplayLayer = ({
  notes,
  sectionRange,
  displaySpec,
  editorKind,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
}) => {
  const [{ patternEnabled, octave, duty }] = useStoreAccess();
  return (
    <div className="absolute-full">
      {notes
        .filter(
          (note) =>
            sectionRange.offset <= note.position &&
            note.position < sectionRange.offset + sectionRange.duration,
        )
        .map((note) => (
          <NoteView
            key={note.id}
            note={note}
            sectionRange={sectionRange}
            displaySpec={displaySpec}
            editorKind={editorKind}
            patternEnabled={patternEnabled}
            octaveShift={octave}
            duty={duty}
          />
        ))}
    </div>
  );
};

const NoteLayerStrip = ({
  notes,
  sectionRange,
  displaySpec,
  editorKind,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
}) => {
  const { cellW, cellH } = displaySpec;
  const numPitches = {
    main: uiConfig.numKeys,
    mainD: uiConfig.numDiatonicLanes,
    pattern: uiConfig.numPatternPitches,
  }[editorKind];
  const editorH = cellH * numPitches;
  const editorW = cellW * sectionRange.duration;
  return (
    <div
      className="relative overflow-hidden touch-none"
      style={{ width: editorW, height: editorH }}
    >
      <NotesDisplayLayer
        notes={notes}
        sectionRange={sectionRange}
        displaySpec={displaySpec}
        editorKind={editorKind}
      />
      <EditInputLayer
        notes={notes}
        sectionRange={sectionRange}
        editorKind={editorKind}
      />
    </div>
  );
};

export const RepeatingNoteLayers = ({
  displaySpec,
  editorKind,
}: {
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
}) => {
  const { store } = useAppContext();
  const { loopBars, pageIndex, inputNotes, mappedNotes, patternNotes } =
    store.useSnapshot();
  const { nx, sectionOffset, sectionStride } = getSectionStride(
    loopBars,
    pageIndex,
  );
  const sectionRange = useMemo(
    () => ({ offset: sectionOffset, duration: sectionStride }),
    [sectionOffset, sectionStride],
  );
  const notes = useMemo(() => {
    let tmpNotes: Note[];
    if (editorKind === "main" || editorKind === "mainD") {
      tmpNotes = mappedNotes ? [...inputNotes, ...mappedNotes] : inputNotes;
    } else {
      tmpNotes = patternNotes;
    }
    return tmpNotes.sort((a, b) => a.pitch - b.pitch);
  }, [inputNotes, mappedNotes, patternNotes, editorKind]);
  return (
    <div className={cz("absolute-full flex-h")}>
      {seqNumbers(nx).map((i) => {
        return (
          <NoteLayerStrip
            key={i}
            notes={notes}
            sectionRange={sectionRange}
            displaySpec={displaySpec}
            editorKind={editorKind}
          />
        );
      })}
    </div>
  );
};
