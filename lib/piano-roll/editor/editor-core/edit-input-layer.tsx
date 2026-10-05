import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../model/app-context";
import { getInputNoteStride, hitTestNote } from "../common/editor-common-logic";
import { IPointerEvent } from "../common/editor-types";
import { createNoteEditActions } from "./edit-input-layer-actions";
import { useNoteLayerContext } from "./note-layer-context";

export const EditInputLayer = () => {
  const { sectionRange, editorKind, notes, loopSteps } = useNoteLayerContext();
  const { store } = useAppContext();
  const { keySpec, sight } = store.useSnapshot();

  const editStride =
    editorKind === "pattern" ? 1 : getInputNoteStride(sight.wBars);

  const noteEditActions = useMemo(
    () => createNoteEditActions(store, editorKind, editStride),
    [store, editorKind, editStride],
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
      editStride,
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

  const handlePointerMove = (e: IPointerEvent) => {
    const { xiFloat, yiFloat } = noteEditActions.mapPointerPositionToCell(
      e.currentTarget as HTMLElement,
      e.clientX,
      e.clientY,
    );
    const hitNoteInfo = hitTestNote(
      notes,
      sectionRange,
      xiFloat,
      yiFloat,
      editorKind,
      keySpec,
      editStride,
    );
    if (hitNoteInfo) {
      store.setHoverNoteInfo({
        noteId: hitNoteInfo.note.id,
        part: hitNoteInfo.part,
      });
    } else {
      store.setHoverNoteInfo(null);
    }
  };

  return (
    <div
      className="absolute-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    />
  );
};
