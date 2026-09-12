import { useEffect, useState } from "react";
import { EditorKind, Note } from "../../definitions/types";
import { useAppContext } from "../../root/app-context";
import { hitTestNote } from "./editor-common-logic";
import { IPointerEvent, SectionRange } from "./editor-types";
import { createNoteEditActions } from "./piano-roll-editor-view-actions";

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
