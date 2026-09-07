import { useMemo } from "react";
import { EdgeUnitItem } from "@/domain/types";
import { store } from "@/store/store";

export function useNoteInputPortIndex(noteChannelId: string) {
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

export function useUnitStuff(unitId: string) {
  const { unitStuffs } = store.useSnapshot();
  return unitStuffs[unitId];
}
