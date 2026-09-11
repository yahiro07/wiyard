import { useEffect, useMemo, useRef, useState } from "react";
import {
  EditorKind,
  LoopBarLength,
  Note,
  NoteKind,
} from "../definitions/types";
import { noteNameLabels, uiConfig } from "../definitions/ui-config";
import { useAppContext, useStoreAccess } from "../root/app-context";
import { colorStyle } from "../utils/color-style";
import { cz } from "../utils/cz";
import { bottomLimit, seqNumbers } from "../utils/helpers";
import {
  DisplaySpec,
  GridDisplaySpec,
  IPointerEvent,
  SectionRange,
} from "./editor-types";
import { createNoteEditActions } from "./piano-roll-editor-view-actions";

export function useGridDisplaySpec(
  displaySpec: DisplaySpec,
  contentBars: number,
  numPitches: number,
) {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const { viewW, viewH, cellW, cellH } = displaySpec;

  const nx = contentBars * 16;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
  const contentX1 = contentX0 + viewW;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const contentY0 = sight.yPosition * maxScrollY;
  const contentY1 = contentY0 + viewH;

  return useMemo(
    () => ({
      contentW,
      contentH,
      viewW,
      viewH,
      contentX0,
      contentX1,
      contentY0,
      contentY1,
      cellW,
      cellH,
      numStepsFull: nx,
      numPitchesFull: numPitches,
    }),
    [
      contentW,
      contentH,
      viewW,
      viewH,
      contentX0,
      contentX1,
      contentY0,
      contentY1,
      cellW,
      cellH,
      nx,
      numPitches,
    ],
  );
}

export const GridCanvas = ({
  displaySpec: ds,
  renderGrid,
}: {
  displaySpec: GridDisplaySpec;
  renderGrid: (canvas: HTMLCanvasElement, ds: GridDisplaySpec) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      renderGrid(canvas, ds);
    }
  }, [ds, renderGrid]);

  const width = Math.round(ds.viewW);
  const height = Math.round(ds.viewH);
  return (
    <canvas
      className="bg-#282828"
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height }}
    />
  );
};

export function getSectionStride(loopBars: LoopBarLength, pageIndex: number) {
  if (loopBars < 2) {
    const nx = 2 / loopBars;
    const sectionStride = 32 / nx;
    return { nx, sectionOffset: 0, sectionStride };
  } else {
    const nx = 1;
    // const sectionStride = 32;
    // const sectionOffset = pageIndex * sectionStride;
    const sectionOffset = 0;
    const sectionStride = loopBars * 16;
    return { nx, sectionOffset, sectionStride };
  }
}

type HitNoteInfo = { note: Note; part: "body" | "tail" };

export function hitTestNote(
  notes: Note[],
  sectionRange: SectionRange,
  xiFloat: number,
  yi: number,
): HitNoteInfo | undefined {
  const xi = Math.floor(xiFloat);
  for (const note of notes) {
    if (note.pitch === yi) {
      const relPos = note.position - sectionRange.offset;
      const dur = note.duration;
      const noteTailPos = relPos + dur;
      if (note.duration >= 2 && xi === noteTailPos - 1) {
        return { note, part: "tail" };
      } else if (relPos <= xi && xi < relPos + dur) {
        return { note, part: "body" };
      }
    }
  }
}

export function getPatternPitchLabel(pitch: number) {
  return pitch - 7 >= 0 ? pitch - 7 + 1 : pitch - 7 - 1;
}

export const EditInputLayer = ({
  notes,
  sectionRange,
  editorKind,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  editorKind: EditorKind;
}) => {
  const { store } = useAppContext();
  const [noteEditActions] = useState(() =>
    createNoteEditActions(store, editorKind),
  );

  const [cursor, setCursor] = useState<string>("auto");

  const handlePointerDown = (e: IPointerEvent) => {
    const { xiFloat, yi } = noteEditActions.mapPointerPositionToCell(
      e.currentTarget as HTMLElement,
      e.clientX,
      e.clientY,
    );
    const hitNoteInfo = hitTestNote(notes, sectionRange, xiFloat, yi);
    if (hitNoteInfo?.note.parentNoteId !== undefined) {
      //move parent
      const parentNote = notes.find(
        (n) => n.id === hitNoteInfo.note.parentNoteId,
      );
      if (parentNote) {
        noteEditActions.startMoveNote(e, parentNote, setCursor);
      }
    } else if (hitNoteInfo?.part === "tail") {
      noteEditActions.startAdjustDuration(
        e,
        hitNoteInfo.note,
        false,
        setCursor,
      );
    } else if (hitNoteInfo?.part === "body") {
      noteEditActions.startMoveNote(e, hitNoteInfo.note, setCursor);
    } else {
      noteEditActions.startInsertNewNote(e, sectionRange, setCursor);
    }
  };
  useEffect(() => {
    document.body.style.cursor = cursor;
  }, [cursor]);

  return <div className="absolute-full" onPointerDown={handlePointerDown} />;
};

const noteColors = {
  input: "#6cc",
  pattern: "#bd8",
  mapped: "#6cc",
};

export const NoteView = ({
  note,
  sectionRange,
  displaySpec,
  editorKind,
  patternEnabled,
}: {
  note: Note;
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  editorKind: EditorKind;
  patternEnabled: boolean;
}) => {
  const { cellW, cellH } = displaySpec;
  const pos = note.position - sectionRange.offset;
  const yi = note.pitch;
  const dur = note.duration;
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
        className={cz(styleNoteView.label)}
        style={{
          height: cellH - 2,
          ...colorStyle({ bg: bgColor, bd: borderColor }),
        }}
      >
        {isPattern ? getPatternPitchLabel(yi) : noteNameLabels[yi]}
      </div>
    </div>
  );
};
const styleNoteView = {
  base: "absolute flex-c cursor-pointer",
  label: cz(
    "w-full flex-ha rounded-2px pl-0.5 text-#0008 text-10px font-monospace",
  ),
};

export const NotesDisplayLayer = ({
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
  const [{ patternEnabled }] = useStoreAccess();
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
          />
        ))}
    </div>
  );
};

export const NoteLayerStrip = ({
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
  const isPattern = editorKind === "pattern";
  const { cellW, cellH } = displaySpec;
  const numPitches = isPattern ? uiConfig.numPatternPitches : uiConfig.numKeys;
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
    if (editorKind === "main") {
      return [...inputNotes, ...mappedNotes];
    } else {
      return patternNotes;
    }
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
