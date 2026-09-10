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

type DisplaySpec = { cellW: number; cellH: number };

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

const NoteView = ({
  note,
  sectionRange,
  displaySpec,
}: {
  note: Note;
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
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
      <div className={styleNoteView.label} style={{ height: cellH - 2 }}>
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
  displaySpec,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
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
          />
        ))}
    </div>
  );
};

const NoteLayerStrip = ({
  notes,
  sectionRange,
  displaySpec,
}: {
  notes: Note[];
  sectionRange: SectionRange;
  displaySpec: DisplaySpec;
}) => {
  const { cellW, cellH } = displaySpec;
  const editorH = cellH * uiConfig.numKeys;
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
      />
      <EditInputLayer notes={notes} sectionRange={sectionRange} />
    </div>
  );
};

const RepeatingNoteLayers = ({ displaySpec }: { displaySpec: DisplaySpec }) => {
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
            displaySpec={displaySpec}
          />
        );
      })}
    </div>
  );
};

const PlayPositionLineLayer = ({
  displaySpec,
}: {
  displaySpec: DisplaySpec;
}) => {
  const { store } = useAppContext();
  const { cellW } = displaySpec;
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

function calculateNotesCenter(notes: Note[], displaySpec: DisplaySpec) {
  const { cellH } = displaySpec;
  let minPitch = notes[0].pitch;
  let maxPitch = notes[0].pitch;
  for (const note of notes) {
    if (note.pitch < minPitch) minPitch = note.pitch;
    if (note.pitch > maxPitch) maxPitch = note.pitch;
  }
  const midPitch = (minPitch + maxPitch) / 2;

  const { numKeys } = uiConfig;
  const editorH = cellH * numKeys;
  return editorH - (midPitch + 0.5) * cellH;
}

function useSetInitialScrollPosition(
  baseDivRef: RefObject<HTMLDivElement | null>,
  displaySpec: DisplaySpec,
) {
  const { store } = useAppContext();
  const { stateLoadRevision, notes } = store.useSnapshot();

  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    const el = baseDivRef.current;
    if (el) {
      const centerY =
        notes.length > 0
          ? calculateNotesCenter(notes, displaySpec)
          : el.scrollHeight / 2;
      el.scrollTop = centerY - el.clientHeight / 2;
    }
  }, [stateLoadRevision]);
}

export const PianoRollEditorView = () => {
  const { store } = useAppContext();
  const { loopBars } = store.useSnapshot();
  const { numKeys } = uiConfig;
  const displaySpec: DisplaySpec = { cellW: 80, cellH: 60 };
  const nx = Math.max(32, loopBars * 16);
  const editorW = displaySpec.cellW * nx;
  const editorH = displaySpec.cellH * numKeys;
  const baseDivRef = useRef<HTMLDivElement>(null);
  useSetInitialScrollPosition(baseDivRef, displaySpec);
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
        <SideKeyboardColumn cellH={displaySpec.cellH} />
      </div>
      <div
        className="relative flex-h"
        style={{ width: editorW, height: editorH }}
      >
        <GridBackground nx={nx} ny={numKeys} width={editorW} height={editorH} />
        <RepeatingNoteLayers displaySpec={displaySpec} />
        <PlayPositionLineLayer displaySpec={displaySpec} />
      </div>
    </div>
  );
};
