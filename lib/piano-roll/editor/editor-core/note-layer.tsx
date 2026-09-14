import { colorStyle } from "@lib/utils/color-style";
import { cz } from "@lib/utils/cz";
import { mapUnaryTo, seqNumbers } from "@lib/utils/number-helper";
import { useMemo } from "react";
import { EditorKind, Note, NoteKind } from "../../definitions/types";
import { uiConfig } from "../../definitions/ui-config";
import { useAppContext, useStoreAccess } from "../../root/app-context";
import {
  diatonicLanesPitchHelper,
  getPatternPitchLabel,
} from "../common/editor-common-logic";
import { DisplaySpec } from "../common/editor-types";
import { getNoteNameLabel } from "../common/note-name-helper";
import { EditInputLayer } from "./edit-input-layer";
import { noteLayerContext, useNoteLayerContext } from "./note-layer-context";

const noteColors = {
  input: "#6cc",
  pattern: "#bd8",
  mapped: "#6cc",
};

const NoteView = ({ note, isGhost }: { note: Note; isGhost: boolean }) => {
  const {
    displaySpec,
    sectionRange,
    editorKind,
    patternEnabled,
    octaveShift,
    noteDuty,
  } = useNoteLayerContext();
  const [{ keySpec }] = useStoreAccess();
  const { cellW, cellH } = displaySpec;
  const pos = note.position - sectionRange.offset;
  const yi0 = note.pitch;
  let yi = note.pitch;
  if (editorKind === "mainD") {
    yi = diatonicLanesPitchHelper.mapPitchToDisplayYIndex(note.pitch, keySpec);
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
      duty = noteDuty;
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
          <NoteView key={note.id} note={note} isGhost={isGhost} />
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
  const loopOffset = sectionRange.offset;
  const displaySteps = sectionRange.duration;
  const numGhostCycles = displaySteps / loopSteps - 1;
  const visibleRangeSteps = loopGhostEnabled ? loopSteps : displaySteps;
  return (
    <div
      className="relative overflow-hidden touch-none shrink-0"
      style={{ width: editorW, height: editorH }}
    >
      <NotesBlockView
        notes={notes}
        sourceOffset={loopOffset}
        sourceDuration={visibleRangeSteps}
        displayOffset={0}
        cellW={cellW}
        isGhost={false}
      />
      {loopGhostEnabled &&
        numGhostCycles > 0 &&
        seqNumbers(numGhostCycles).map((i) => (
          <NotesBlockView
            key={i}
            notes={notes}
            sourceOffset={loopOffset}
            sourceDuration={visibleRangeSteps}
            displayOffset={(i + 1) * visibleRangeSteps}
            cellW={cellW}
            isGhost={true}
          />
        ))}
      {loopSteps !== displaySteps && (
        <div
          className="absolute top-0 h-full bg-black/10"
          style={{
            left: loopSteps * cellW,
            width: (displaySteps - loopSteps) * cellW,
          }}
        />
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
  const {
    inputNotes,
    mappedNotes,
    patternNotes,
    loopGhostEnabled,
    patternEnabled,
    octave: octaveShift,
    duty: noteDuty,
  } = store.useSnapshot();

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

  const contextValue = useMemo(
    () => ({
      sectionRange,
      displaySpec,
      editorKind,
      notes,
      loopSteps,
      loopGhostEnabled,
      patternEnabled,
      octaveShift,
      noteDuty,
    }),
    [
      sectionRange,
      displaySpec,
      editorKind,
      notes,
      loopSteps,
      loopGhostEnabled,
      patternEnabled,
      octaveShift,
      noteDuty,
    ],
  );

  return (
    <div className={cz("absolute-full")}>
      <noteLayerContext.Provider value={contextValue}>
        <NoteLayerStrip />
      </noteLayerContext.Provider>
    </div>
  );
};
