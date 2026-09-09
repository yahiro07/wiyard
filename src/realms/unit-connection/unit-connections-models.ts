import { useMemo } from "react";
import { store } from "@/store/store";

type NoteInputConnectionViewModel = {
  source: string;
  destination: string;
};

export function useNoteInputConnectionViewModels(): NoteInputConnectionViewModel[] {
  const { unitItems, offStageUnitItems } = store.useSnapshot();
  return useMemo(() => {
    return offStageUnitItems
      .map((item) => {
        const noteChannelId = item.noteChannelId;
        const destUnitItem = unitItems.find(
          (it) =>
            it.type === "edge" &&
            it.internalUnitKey === "noteInputPort" &&
            it.noteChannelId === noteChannelId,
        );
        if (!destUnitItem) return undefined;
        const source = `${item.unitId}.noteOutput`;
        const destination = `${destUnitItem.unitId}.noteInput`;
        return { source, destination };
      })
      .filter(Boolean) as NoteInputConnectionViewModel[];
  }, [offStageUnitItems, unitItems]);
}
