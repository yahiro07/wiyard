import { startDragSessionV0 } from "@lib/utils/drag-session-v0";
import { EditorKind, LoopBarLength, Note } from "../../definitions/types";
import { uiConfig } from "../../definitions/ui-config";
import { AppStore } from "../../root/store";
import {
  diatonicLanesPitchHelper,
  getLoopBarLengthForStep,
} from "../common/editor-common-logic";
import { IPointerEvent, SectionRange } from "../common/editor-types";

function createTapChecker() {
  const startTime = Date.now();
  return {
    check() {
      const endTime = Date.now();
      const duration = endTime - startTime;
      return duration <= 200;
    },
  };
}

type setCursorFn = (cursor: string) => void;

export function createNoteEditActions(
  store: AppStore,
  editorKind: EditorKind,
  editStride: number,
) {
  const isPattern = editorKind === "pattern";
  // const numPitches = isPattern ? uiConfig.numPatternPitches : uiConfig.numKeys;
  const numPitches = {
    main: uiConfig.numKeys,
    mainD: uiConfig.numDiatonicLanes,
    pattern: uiConfig.numPatternPitches,
  }[editorKind];
  const storeAccess = {
    getNotes: () =>
      isPattern ? store.state.patternNotes : store.state.inputNotes,
    setNotes: isPattern ? store.setPatternNotes : store.setInputNotes,
    getPreviewNotePitch: () =>
      isPattern ? null : store.state.previewNotePitch,
    setPreviewNotePitch: isPattern ? () => {} : store.setPreviewNotePitch,
  };

  const sectionDuration = isPattern ? 32 : 256;

  const core = {
    mapYIndexToPitch(yi: number) {
      if (editorKind === "mainD") {
        return diatonicLanesPitchHelper.mapYIndexToPitch(
          yi,
          store.state.keySpec,
        );
      }
      return yi;
    },
    shiftPitch(originalPitch: number, deltaYi: number) {
      if (editorKind === "mainD") {
        const snapToScale = !store.state.diatonicLanesAllowSemitoneInput;
        return diatonicLanesPitchHelper.shiftPitch(
          originalPitch,
          deltaYi,
          snapToScale,
          store.state.keySpec,
        );
      }
      return originalPitch + Math.round(deltaYi);
    },
  };

  const self = {
    mapPointerPositionToCell(
      el: HTMLElement,
      x: number,
      y: number,
    ): { xi: number; xiFloat: number; yi: number; yiFloat: number } {
      const rect = el.getBoundingClientRect();
      const xiFloat = ((x - rect.left) / rect.width) * sectionDuration;
      const xi = Math.floor(xiFloat / editStride) * editStride;
      const yiFloat = (1 - (y - rect.top) / rect.height) * numPitches;
      const yi = Math.floor(yiFloat);
      return { xi, xiFloat, yi, yiFloat };
    },
    addNote(position: number, yi: number) {
      const notes = storeAccess.getNotes();
      const nextId =
        notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 0;
      const pitch = core.mapYIndexToPitch(yi);
      const newNote: Note = {
        id: nextId,
        position,
        duration: editStride,
        pitch,
      };
      storeAccess.setNotes((prev) => [...prev, newNote]);
      return newNote;
    },
    setNoteAttrs(noteId: number, attrs: Partial<Note>) {
      storeAccess.setNotes((prev) =>
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
      storeAccess.setNotes((prev) => prev.filter((note) => note.id !== noteId));
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
      storeAccess.setPreviewNotePitch(originalNote.pitch);

      setCursor("move");

      const tapChecker = createTapChecker();
      startDragSessionV0(
        e0.nativeEvent,
        {
          onMove(e) {
            const movedCoord = self.mapPointerPositionToCell(
              baseEl,
              e.position.x,
              e.position.y,
            );
            const deltaXi = movedCoord.xi - originalCoord.xi;
            const deltaYi = movedCoord.yiFloat - originalCoord.yiFloat;

            const position = originalNote.position + deltaXi;
            const pitch = core.shiftPitch(originalNote.pitch, deltaYi);

            if (storeAccess.getPreviewNotePitch() !== pitch) {
              storeAccess.setPreviewNotePitch(pitch);
            }

            noteLatest = self.updateNoteXY(noteLatest, position, pitch);
          },
          onUpOrCancel() {
            const tapped = tapChecker.check() && noteLatest === originalNote;
            if (tapped) {
              self.removeNote(noteLatest.id);
            }
            storeAccess.setPreviewNotePitch(null);
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
      storeAccess.setPreviewNotePitch(originalNote.pitch);

      setCursor(isNewNote ? "pointer" : "e-resize");

      const tapChecker = createTapChecker();
      startDragSessionV0(
        e0.nativeEvent,
        {
          onMove(e) {
            const movedCoord = self.mapPointerPositionToCell(
              baseEl,
              e.position.x,
              e.position.y,
            );
            const deltaXi = movedCoord.xi - originalCoord.xi;
            const deltaYi = movedCoord.yiFloat - originalCoord.yiFloat;

            // const duration = originalNote.duration + deltaXi;
            const duration = Math.max(
              editStride,
              Math.floor((originalNote.duration + deltaXi) / editStride) *
                editStride,
            );
            let canShiftPitch = false;
            if (1) {
              //allow pitch change for duration edit
              canShiftPitch = true;
            } else {
              //disable pitch change for duration edit
              canShiftPitch = isNewNote;
            }
            const pitch = canShiftPitch
              ? core.shiftPitch(originalNote.pitch, deltaYi)
              : originalNote.pitch;
            if (pitch !== storeAccess.getPreviewNotePitch()) {
              storeAccess.setPreviewNotePitch(pitch);
            }
            noteLatest = self.updateNoteXYD(noteLatest, duration, pitch);
          },
          onUp() {
            const tapped =
              !isNewNote && tapChecker.check() && noteLatest === originalNote;
            if (noteLatest.duration <= 0 || tapped) {
              self.removeNote(noteLatest.id);
            }
            storeAccess.setPreviewNotePitch(null);

            if (isNewNote && editorKind !== "pattern") {
              self.autoExtendEnsureLoopBarsForTail(
                noteLatest.position + noteLatest.duration,
              );
            }
          },
          onUpOrCancel() {
            setCursor("auto");
          },
        },
        { coordinate: "page" },
      );
    },
    autoExtendEnsureLoopBarsForTail(tail: number) {
      const idealLoopBar = getLoopBarLengthForStep(tail - 0.01);
      if (store.state.loopBars < idealLoopBar) {
        store.setLoopBars(idealLoopBar);
      }
    },
    extendLoopBars() {
      const { loopBars } = store.state;
      if (loopBars < 16) {
        store.setLoopBars((loopBars * 2) as LoopBarLength);
      }
    },
  };
  return self;
}
