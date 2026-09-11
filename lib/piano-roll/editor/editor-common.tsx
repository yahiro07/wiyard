import { useEffect, useMemo, useRef, useState } from "react";
import { LoopBarLength, Note } from "../definitions/types";
import { noteNameLabels, uiConfig } from "../definitions/ui-config";
import { useAppContext } from "../root/app-context";
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
      className="bg-#888"
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
  isPattern,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  isPattern: boolean;
}) => {
  const { store } = useAppContext();
  const [noteEditActions] = useState(() =>
    createNoteEditActions(store, isPattern),
  );

  const [cursor, setCursor] = useState<string>("auto");

  const handlePointerDown = (e: IPointerEvent) => {
    const { xiFloat, yi } = noteEditActions.mapPointerPositionToCell(
      e.currentTarget as HTMLElement,
      e.clientX,
      e.clientY,
    );
    const hitNoteInfo = hitTestNote(notes, sectionRange, xiFloat, yi);
    if (hitNoteInfo?.part === "tail") {
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

export const NoteView = ({
  note,
  sectionRange,
  displaySpec,
  isPattern,
}: {
  note: Note;
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  isPattern: boolean;
}) => {
  const { cellW, cellH } = displaySpec;
  const pos = note.position - sectionRange.offset;
  const yi = note.pitch;
  const dur = note.duration;
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
        className={cz(styleNoteView.label, isPattern && "!bg-#bd8")}
        style={{ height: cellH - 2 }}
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
    "bg-[var(--cl-note-bg)] bd-#0004",
  ),
};

export const NotesDisplayLayer = ({
  notes,
  sectionRange,
  displaySpec,
  isPattern,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  isPattern: boolean;
}) => {
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
            isPattern={isPattern}
          />
        ))}
    </div>
  );
};

export const NoteLayerStrip = ({
  notes,
  sectionRange,
  displaySpec,
  isPattern,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
  isPattern: boolean;
}) => {
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
        isPattern={isPattern}
      />
      <EditInputLayer
        notes={notes}
        sectionRange={sectionRange}
        isPattern={isPattern}
      />
    </div>
  );
};

export const RepeatingNoteLayers = ({
  displaySpec,
  isPattern,
}: {
  displaySpec: DisplaySpec;
  isPattern: boolean;
}) => {
  const { store } = useAppContext();
  const st = store.useSnapshot();
  const { nx, sectionOffset, sectionStride } = getSectionStride(
    st.loopBars,
    st.pageIndex,
  );
  const sectionRange = useMemo(
    () => ({ offset: sectionOffset, duration: sectionStride }),
    [sectionOffset, sectionStride],
  );
  return (
    <div className="absolute-full flex-h">
      {seqNumbers(nx).map((i) => {
        return (
          <NoteLayerStrip
            key={i}
            notes={isPattern ? st.patternNotes : st.notes}
            sectionRange={sectionRange}
            displaySpec={displaySpec}
            isPattern={isPattern}
          />
        );
      })}
    </div>
  );
};
