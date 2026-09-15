import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../root/app-context";
import { hitTestNote } from "../common/editor-common-logic";
import { IPointerEvent } from "../common/editor-types";
import { createNoteEditActions } from "./edit-input-layer-actions";
import { useNoteLayerContext } from "./note-layer-context";

export const EditInputLayer = () => {
  const { sectionRange, editorKind, notes, loopSteps } = useNoteLayerContext();
  const { store } = useAppContext();
  const { keySpec } = store.useSnapshot();
  const noteEditActions = useMemo(
    () => createNoteEditActions(store, editorKind, sectionRange.duration),
    [store, sectionRange, editorKind],
  );

  const [cursor, setCursor] = useState<string>("auto");

  const handlePointerDown = (e: IPointerEvent) => {
    const { xiFloat, yiFloat } = noteEditActions.mapPointerPositionToCell(
      e.currentTarget as HTMLElement,
      e.clientX,
      e.clientY,
    );
    if (xiFloat > loopSteps) {
      if (store.state.loopGhostEnabled) {
        noteEditActions.autoExtendEnsureLoopBarsForTail(xiFloat);
        return;
      }
    }
    const hitNoteInfo = hitTestNote(
      notes,
      sectionRange,
      xiFloat,
      yiFloat,
      editorKind,
      keySpec,
    );

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
