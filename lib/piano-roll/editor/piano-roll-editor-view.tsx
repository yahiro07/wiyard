import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Note } from "../definitions/types";
import { noteNameLabels, uiConfig } from "../definitions/ui-config";
import { useAppContext } from "../root/app-context";
import { cz } from "../utils/cz";
import { seqNumbers } from "../utils/helpers";
import { GridBackground } from "./grid-background";
import {
  createNoteEditActions,
  getSectionStride,
  hitTestNote,
  SectionRange,
} from "./piano-roll-editor-view-actions";
import { SideKeyboardColumn } from "./side-keyboard-column";

type PointerEvent = React.PointerEvent<HTMLDivElement>;

const EditInputLayer = ({
  notes,
  sectionRange,
}: {
  notes: Note[];
  sectionRange: SectionRange;
}) => {
  const { store } = useAppContext();
  const [noteEditActions] = useState(() => createNoteEditActions(store));

  const [cursor, setCursor] = useState<string>("auto");

  const handlePointerDown = (e: PointerEvent) => {
    const { xiFloat, yi } = noteEditActions.mapPointerPositionToCell(
      e.currentTarget as HTMLElement,
      e.clientX,
      e.clientY,
    );
    const hitNoteInfo = hitTestNote(notes, sectionRange, xiFloat, yi);
    if (hitNoteInfo?.part === "tail") {
      noteEditActions.startAdjustDuration(e, hitNoteInfo.note, false);
      setCursor("e-resize");
    } else if (hitNoteInfo?.part === "body") {
      noteEditActions.startMoveNote(e, hitNoteInfo.note);
      setCursor("move");
    } else {
      noteEditActions.startInsertNewNote(e, sectionRange);
      setCursor("pointer");
    }
  };

  const handlePointerUp = () => {
    setCursor("auto");
  };
  return (
    <div
      className="absolute-full"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ cursor }}
    />
  );
};

const NoteView = ({
  note,
  sectionRange,
}: {
  note: Note;
  sectionRange: SectionRange;
}) => {
  const { cellW, cellH } = uiConfig;
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
        className={styleNoteView.label}
        style={{ height: uiConfig.cellH - 2 }}
      >
        {noteNameLabels[yi]}
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

const NotesDisplayLayer = ({
  notes,
  sectionRange,
}: {
  notes: Note[];
  sectionRange: SectionRange;
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
          <NoteView key={note.id} note={note} sectionRange={sectionRange} />
        ))}
    </div>
  );
};

const NoteLayerStrip = ({
  notes,
  sectionRange,
}: {
  notes: Note[];
  sectionRange: SectionRange;
}) => {
  const { cellW, cellH, numKeys } = uiConfig;
  const editorH = cellH * numKeys;
  const editorW = cellW * sectionRange.duration;
  return (
    <div
      className="relative overflow-hidden touch-none"
      style={{ width: editorW, height: editorH }}
    >
      <NotesDisplayLayer notes={notes} sectionRange={sectionRange} />
      <EditInputLayer notes={notes} sectionRange={sectionRange} />
    </div>
  );
};

const RepeatingNoteLayers = () => {
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
            notes={st.notes}
            sectionRange={sectionRange}
          />
        );
      })}
    </div>
  );
};

const PlayPositionLineLayer = () => {
  const { store } = useAppContext();
  const { cellW } = uiConfig;
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

function calculateNotesCenter(notes: Note[]) {
  let minPitch = notes[0].pitch;
  let maxPitch = notes[0].pitch;
  for (const note of notes) {
    if (note.pitch < minPitch) minPitch = note.pitch;
    if (note.pitch > maxPitch) maxPitch = note.pitch;
  }
  const midPitch = (minPitch + maxPitch) / 2;

  const { cellH, numKeys } = uiConfig;
  const editorH = cellH * numKeys;
  return editorH - (midPitch + 0.5) * cellH;
}

function useSetInitialScrollPosition(
  baseDivRef: RefObject<HTMLDivElement | null>,
) {
  const { store } = useAppContext();
  const { stateLoadRevision, notes } = store.useSnapshot();

  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    const el = baseDivRef.current;
    if (el) {
      const centerY =
        notes.length > 0 ? calculateNotesCenter(notes) : el.scrollHeight / 2;
      el.scrollTop = centerY - el.clientHeight / 2;
    }
  }, [stateLoadRevision]);
}

export const PianoRollEditorView = () => {
  const { store } = useAppContext();
  const { loopBars } = store.useSnapshot();
  const { cellW, cellH, numKeys } = uiConfig;
  const nx = Math.max(32, loopBars * 16);
  const editorW = cellW * nx;
  const editorH = cellH * numKeys;
  const baseDivRef = useRef<HTMLDivElement>(null);
  useSetInitialScrollPosition(baseDivRef);
  return (
    <div
      ref={baseDivRef}
      className={cz(
        "flex-h gap-0.5 overflow-x-scroll overflow-y-scroll touch-pan-y",
        "grow bd-red w-full",
      )}
      onWheel={(e) => {
        e.stopPropagation();
        // e.preventDefault();
      }}
    >
      <div className="sticky left-0  z-10">
        <SideKeyboardColumn />
      </div>
      <div
        className="relative flex-h"
        style={{ width: editorW, height: editorH }}
      >
        <GridBackground nx={nx} ny={numKeys} width={editorW} height={editorH} />
        <RepeatingNoteLayers />
        <PlayPositionLineLayer />
      </div>
    </div>
  );
};
