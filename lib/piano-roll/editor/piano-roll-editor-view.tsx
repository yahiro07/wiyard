import { useEffect, useMemo, useRef, useState } from "react";
import { Note } from "../definitions/types";
import { noteNameLabels, uiConfig } from "../definitions/ui-config";
import { useAppContext } from "../root/app-context";
import { cz } from "../utils/cz";
import { bottomLimit, mapUnaryTo, seqNumbers } from "../utils/helpers";
import { useDomElementSize } from "../utils/use-dom-element-size";
import { useGridDisplaySpec } from "./editor-common";
import { EditorCommonLayout } from "./editor-common-layout";
import {
  createNoteEditActions,
  getSectionStride,
  hitTestNote,
  SectionRange,
} from "./piano-roll-editor-view-actions";
import { PianoRollGrid } from "./piano-roll-grid";
import { SideKeyboardColumn } from "./side-keyboard-column";

type PointerEvent = React.PointerEvent<HTMLDivElement>;

type DisplaySpec = {
  viewW: number;
  viewH: number;
  cellW: number;
  cellH: number;
};

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

const PianoRollEditPart = ({ displaySpec }: { displaySpec: DisplaySpec }) => {
  const { store } = useAppContext();
  const { loopBars, sight } = store.useSnapshot();
  const { numKeys } = uiConfig;
  const { viewW, cellW, cellH } = displaySpec;

  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop
  const nx = contentBars * 16;
  const contentW = cellW * nx;
  const contentH = cellH * numKeys;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
  const left = -contentX0;

  return (
    <div className={cz("overflow-hidden")}>
      <div
        className="relative flex-h"
        style={{
          width: contentW,
          height: contentH,
          transform: `translateX(${left}px)`,
        }}
      >
        <RepeatingNoteLayers displaySpec={displaySpec} />
        <PlayPositionLineLayer displaySpec={displaySpec} />
      </div>
    </div>
  );
};

const GridBackgroundContainer = ({
  displaySpec,
}: {
  displaySpec: DisplaySpec;
}) => {
  const { store } = useAppContext();
  const { loopBars } = store.useSnapshot();
  const { numKeys: numPitches } = uiConfig;
  const contentBars = bottomLimit(loopBars, 2); //repeat contents for short loop

  const gridDisplaySpec = useGridDisplaySpec(
    displaySpec,
    contentBars,
    numPitches,
  );
  return <PianoRollGrid displaySpec={gridDisplaySpec} />;
};

export const PianoRollEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const { numKeys } = uiConfig;

  const size = useDomElementSize(measuredDivRef);
  const viewW = size?.width ?? 100;
  const viewH = size?.height ?? 100;

  const displaySpec: DisplaySpec = {
    viewW,
    viewH,
    cellW: mapUnaryTo(sight.xZoom, 20, 80),
    cellH: mapUnaryTo(sight.yZoom, 20, 60),
  };
  const keysWidth = 100;

  const contentH = displaySpec.cellH * numKeys;
  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const ty = -sight.yPosition * maxScrollY;

  return (
    <EditorCommonLayout
      measuredDivRef={measuredDivRef}
      sideContent={
        <div style={{ transform: `translateY(${ty}px)` }}>
          <SideKeyboardColumn cellH={displaySpec.cellH} width={keysWidth} />
        </div>
      }
      sideContentWidth={keysWidth}
      mainContent={
        <>
          <GridBackgroundContainer displaySpec={displaySpec} />
          <div
            className="absolute-full"
            style={{ transform: `translateY(${ty}px)` }}
          >
            <PianoRollEditPart displaySpec={displaySpec} />
          </div>
        </>
      }
    />
  );
};
