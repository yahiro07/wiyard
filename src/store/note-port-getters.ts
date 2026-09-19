import { useMemo } from "react";
import { NoteInputPortUnitItem, UnitItem } from "@/domain/types";
import { store } from "@/store/store";

export const notePortGetters = {
  filterNoteInputPortUnitItems(unitItems: UnitItem[]): NoteInputPortUnitItem[] {
    return unitItems.filter((item) => item.type === "noteInput");
  },
  useNoteInputPortUnitItems() {
    const { unitItems } = store.useSnapshot();
    return useMemo(
      () => notePortGetters.filterNoteInputPortUnitItems(unitItems),
      [unitItems],
    );
  },
  useNoteChannelIds() {
    const { unitItems } = store.useSnapshot();
    return useMemo(
      () =>
        notePortGetters
          .filterNoteInputPortUnitItems(unitItems)
          .map((item) => item.unitId),
      [unitItems],
    );
  },
  useNoteInputPortIndex(noteChannelId: string) {
    const noteInputPortUnitItems = notePortGetters.useNoteInputPortUnitItems();
    return useMemo(() => {
      return noteInputPortUnitItems.findIndex(
        (item) => item.unitId === noteChannelId,
      );
    }, [noteInputPortUnitItems, noteChannelId]);
  },
  getSequencerUnitId(notePortUnitId: string) {
    return `${notePortUnitId}_sourceSequencer`;
  },
};
