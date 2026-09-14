import { colorStyle } from "@lib/utils/color-style";
import { cz } from "@lib/utils/cz";
import { mapUnaryTo } from "@lib/utils/number-helper";
import { useMemo } from "react";
import { EditorKind, Note, NoteKind } from "../../definitions/types";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext, useStoreAccess } from "../../root/app-context";
import { EditInputLayer } from "./edit-input-layer";
import {
  diatonicLanesPitchHelper,
  getPatternPitchLabel,
} from "../common/editor-common-logic";
import { DisplaySpec } from "../common/editor-types";
import { getNoteNameLabel } from "../common/note-name-helper";
import { useNoteLayerContext, noteLayerContext } from "./note-layer-context";

const noteColors = {
  input: "#6cc",
  pattern: "#bd8",
  mapped: "#6cc",
};

const NoteView = ({
  note,
  patternEnabled,
  octaveShift,
  duty: inputDuty,
  isGhost,
}: {
  note: Note;
  patternEnabled: boolean;
  octaveShift: number;
  duty: number;
  isGhost: boolean;
}) => {
  const { displaySpec, sectionRange, editorKind } = useNoteLayerContext();
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
  if (isGhost) {
    bgColor = "#fff2";
    borderColor = "#fff2";
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

const NotesBlockView = ({
  notes,
  sourceOffset,
  sourceDuration,
  displayOffset,
  cellW,
  isGhost,
}: {
  notes: Note[];
  sourceOffset: number;
  sourceDuration: number;
  displayOffset: number;
  cellW: number;
  isGhost: boolean;
}) => {
  const [{ patternEnabled, octave, duty }] = useStoreAccess();
  return (
    <div
      className="absolute-full"
      style={{ transform: `translateX(${displayOffset * cellW}px)` }}
    >
      {notes
        .filter(
          (note) =>
            sourceOffset <= note.position &&
            note.position < sourceOffset + sourceDuration,
        )
        .map((note) => (
          <NoteView
            key={note.id}
            note={note}
            patternEnabled={patternEnabled}
            octaveShift={octave}
            duty={duty}
            isGhost={isGhost}
          />
        ))}
    </div>
  );
};

const NoteLayerStrip = () => {
  const {
    notes,
    displaySpec,
    sectionRange,
    editorKind,
    loopSteps,
    loopGhostEnabled,
  } = useNoteLayerContext();
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
      className="relative overflow-hidden touch-none shrink-0"
      style={{ width: editorW, height: editorH }}
    >
      <NotesBlockView
        notes={notes}
        sourceOffset={sectionRange.offset}
        sourceDuration={sectionRange.duration}
        displayOffset={0}
        cellW={cellW}
        isGhost={false}
      />
      {loopGhostEnabled && (
        <>
          <NotesBlockView
            notes={notes}
            sourceOffset={sectionRange.offset}
            sourceDuration={sectionRange.duration}
            displayOffset={loopSteps}
            cellW={cellW}
            isGhost={true}
          />
        </>
      )}
      <EditInputLayer />
    </div>
  );
};

export const NoteLayerRoot = ({
  displaySpec,
  editorKind,
  displaySteps,
  loopSteps,
}: {
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
  displaySteps: number;
  loopSteps: number;
}) => {
  const { store } = useAppContext();
  const { inputNotes, mappedNotes, patternNotes, loopGhostEnabled } =
    store.useSnapshot();

  const sectionRange = useMemo(
    () => ({ offset: 0, duration: displaySteps }),
    [displaySteps],
  );
  const notes = useMemo(() => {
    let tmpNotes: Note[];
    if (editorKind === "main" || editorKind === "mainD") {
      tmpNotes = mappedNotes ? [...inputNotes, ...mappedNotes] : inputNotes;
    } else {
      tmpNotes = [...patternNotes];
    }
    return tmpNotes.sort((a, b) => a.pitch - b.pitch);
  }, [inputNotes, mappedNotes, patternNotes, editorKind]);

  return (
    <div className={cz("absolute-full")}>
      <noteLayerContext.Provider
        value={{
          sectionRange,
          displaySpec,
          editorKind,
          notes,
          loopSteps,
          loopGhostEnabled,
        }}
      >
        <NoteLayerStrip />
      </noteLayerContext.Provider>
    </div>
  );
};
