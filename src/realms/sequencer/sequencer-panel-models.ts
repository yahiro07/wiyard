import { useMemo } from "react";
import { store } from "@/store/store";

export type NoteChannelListColumnPresenter = {
  noteChannelIds: string[];
  currentNoteChannelId: string;
  selectNoteChannel: (noteChannelId: string) => void;
};

export function useNoteChannelListColumnPresenter(): NoteChannelListColumnPresenter {
  const { offStageUnitItems, currentNoteChannelId } = store.useSnapshot();
  return useMemo(() => {
    const noteChannelIds = offStageUnitItems.map((item) => item.noteChannelId);
    return {
      noteChannelIds,
      currentNoteChannelId,
      selectNoteChannel(noteChannelId) {
        store.setCurrentNoteChannelId(noteChannelId);
      },
    };
  }, [offStageUnitItems, currentNoteChannelId]);
}
