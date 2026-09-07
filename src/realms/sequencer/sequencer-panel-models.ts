import { useMemo } from "react";
import { OffStageUnitItem } from "@/domain/types";
import { store } from "@/store/store";

export type NoteChannelListColumnPresenter = {
  noteChannelIds: string[];
  currentNoteChannelId: string;
  selectNoteChannel: (noteChannelId: string) => void;
};
export function useNoteChannelListColumnPresenter(): NoteChannelListColumnPresenter {
  const { unitItems, currentNoteChannelId } = store.useSnapshot();
  return useMemo(() => {
    const noteChannelIds = (
      unitItems.filter((item) => item.type === "offStage") as OffStageUnitItem[]
    ).map((item) => item.noteChannelId);
    return {
      noteChannelIds,
      currentNoteChannelId,
      selectNoteChannel(noteChannelId) {
        store.setCurrentNoteChannelId(noteChannelId);
      },
    };
  }, [unitItems, currentNoteChannelId]);
}

export function useOffStageUnitItems() {
  const { unitItems } = store.useSnapshot();
  return unitItems.filter((item) => item.type === "offStage");
}
