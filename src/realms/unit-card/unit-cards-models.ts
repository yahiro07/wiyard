import { useMemo } from "react";
import { EdgeUnitItem } from "@/domain/types";
import { store } from "@/store/store";

function useNoteOutputPortIndex(noteChannelId: string) {
  const { unitItems } = store.useSnapshot();
  return useMemo(() => {
    const noteInputPortItems = unitItems.filter(
      (item) =>
        item.type === "edge" && item.internalUnitKey === "noteInputPort",
    ) as EdgeUnitItem[];
    return noteInputPortItems.findIndex(
      (item) => item.noteChannelId === noteChannelId,
    );
  }, [unitItems, noteChannelId]);
}

export function useEdgeUnitCardStates_NoteInputPort(unitItem: EdgeUnitItem) {
  const { currentNoteChannelId } = store.useSnapshot();
  const index = useNoteOutputPortIndex(unitItem.noteChannelId);
  const isCurrent = unitItem.noteChannelId === currentNoteChannelId;
  return { index, isCurrent };
}

export function useUnitStuff(unitId: string) {
  const { unitStuffs } = store.useSnapshot();
  return unitStuffs[unitId];
}
