import { LoopBarLength, Note } from "../definitions/types";
import { uiConfig } from "../definitions/ui-config";
import { AppStore } from "../root/store";
import { startDragSession } from "../utils/drag-session-v0";
import { IPointerEvent, SectionRange } from "./editor-types";

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

function createTapChecker() {
  const startTime = Date.now();
  return {
    check() {
      const endTime = Date.now();
      const duration = endTime - startTime;
      return duration <= 100;
    },
  };
}

type setCursorFn = (cursor: string) => void;

export function createNoteEditActions(store: AppStore) {
  const self = {
    mapPointerPositionToCell(
      el: HTMLElement,
      x: number,
      y: number,
    ): { xi: number; xiFloat: number; yi: number; yiFloat: number } {
      const st = store.state;
      const { sectionStride } = getSectionStride(st.loopBars, st.pageIndex);
      const rect = el.getBoundingClientRect();
      const xiFloat = ((x - rect.left) / rect.width) * sectionStride;
      const xi = Math.floor(xiFloat);
      const yiFloat = (1 - (y - rect.top) / rect.height) * uiConfig.numKeys;
      const yi = Math.floor(yiFloat);
      return { xi, xiFloat, yi, yiFloat };
    },
    addNote(position: number, yi: number) {
      const nextId =
        store.state.notes.length > 0
          ? Math.max(...store.state.notes.map((note) => note.id)) + 1
          : 0;
      const newNote: Note = {
        id: nextId,
        position,
        duration: 1,
        pitch: yi,
      };
      store.setNotes((prev) => [...prev, newNote]);
      return newNote;
    },
    setNoteAttrs(noteId: number, attrs: Partial<Note>) {
      store.setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? { ...note, ...attrs } : note)),
      );
    },
    updateNoteXY(note: Note, position: number, pitch: number) {
      if (!(note.position === position && note.pitch === pitch)) {
        self.setNoteAttrs(note.id, { position, pitch });
        return { ...note, position, pitch };
      }
      return note;
    },
    updateNoteXYD(note: Note, duration: number, pitch: number) {
      if (!(note.duration === duration && note.pitch === pitch)) {
        self.setNoteAttrs(note.id, { duration, pitch });
        return { ...note, duration, pitch };
      }
      return note;
    },
    removeNote(noteId: number) {
      store.setNotes((prev) => prev.filter((note) => note.id !== noteId));
    },
    startInsertNewNote(
      e0: IPointerEvent,
      sectionRange: SectionRange,
      setCursor: setCursorFn,
    ) {
      const { xi, yi } = self.mapPointerPositionToCell(
        e0.currentTarget as HTMLElement,
        e0.clientX,
        e0.clientY,
      );
      const position = sectionRange.offset + xi;
      const note = self.addNote(position, yi);
      self.startAdjustDuration(e0, note, true, setCursor);
    },
    startMoveNote(
      e0: IPointerEvent,
      originalNote: Note,
      setCursor: setCursorFn,
    ) {
      let noteLatest = originalNote;
      const baseEl = e0.currentTarget as HTMLElement;
      const originalCoord = self.mapPointerPositionToCell(
        baseEl,
        e0.clientX,
        e0.clientY,
      );
      store.setPreviewNotePitch(originalNote.pitch);

      setCursor("move");

      const tapChecker = createTapChecker();
      startDragSession(
        e0.nativeEvent,
        {
          onMove(e) {
            const movedCoord = self.mapPointerPositionToCell(
              baseEl,
              e.position.x,
              e.position.y,
            );
            const deltaXi = movedCoord.xi - originalCoord.xi;
            const deltaYi = movedCoord.yi - originalCoord.yi;

            const position = originalNote.position + deltaXi;
            const pitch = originalNote.pitch + deltaYi;

            if (store.state.previewNotePitch !== pitch) {
              store.setPreviewNotePitch(pitch);
            }

            noteLatest = self.updateNoteXY(noteLatest, position, pitch);
          },
          onUpOrCancel() {
            const tapped = tapChecker.check() && noteLatest === originalNote;
            if (tapped) {
              self.removeNote(noteLatest.id);
            }
            store.setPreviewNotePitch(null);
            setCursor("auto");
          },
        },
        { coordinate: "page" },
      );
    },
    startAdjustDuration(
      e0: IPointerEvent,
      originalNote: Note,
      isNewNote: boolean,
      setCursor: setCursorFn,
    ) {
      let noteLatest = originalNote;
      const baseEl = e0.currentTarget as HTMLElement;
      const originalCoord = self.mapPointerPositionToCell(
        baseEl,
        e0.clientX,
        e0.clientY,
      );
      store.setPreviewNotePitch(originalNote.pitch);

      setCursor(isNewNote ? "pointer" : "e-resize");

      const tapChecker = createTapChecker();
      startDragSession(
        e0.nativeEvent,
        {
          onMove(e) {
            const movedCoord = self.mapPointerPositionToCell(
              baseEl,
              e.position.x,
              e.position.y,
            );
            const deltaXi = movedCoord.xi - originalCoord.xi;
            const deltaYi = movedCoord.yi - originalCoord.yi;

            const duration = originalNote.duration + deltaXi;
            const pitch = isNewNote
              ? originalNote.pitch + deltaYi
              : originalNote.pitch;

            if (pitch !== store.state.previewNotePitch) {
              store.setPreviewNotePitch(pitch);
            }
            noteLatest = self.updateNoteXYD(noteLatest, duration, pitch);
          },
          onUp() {
            const tapped =
              !isNewNote && tapChecker.check() && noteLatest === originalNote;
            if (noteLatest.duration <= 0 || tapped) {
              self.removeNote(noteLatest.id);
            }
            store.setPreviewNotePitch(null);
          },
          onUpOrCancel() {
            setCursor("auto");
          },
        },
        { coordinate: "page" },
      );
    },
  };
  return self;
}
