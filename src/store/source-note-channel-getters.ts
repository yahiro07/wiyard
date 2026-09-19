import { useMemo } from "react";
import { decodeWireConnectionKey } from "@/domain/port-helpers";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";

export const sourceNoteChannelGetters = {
  useUnitSourceActiveNoteChannelIndex(unitId: string): number | undefined {
    const { currentNoteChannelId, wireConnectionKeys, unitItems } =
      store.useSnapshot();
    return useMemo(() => {
      if (!currentNoteChannelId) return undefined;
      const connected = wireConnectionKeys.some((key) => {
        const { sourceUnitId, destinationUnitId } =
          decodeWireConnectionKey(key);
        return (
          sourceUnitId === currentNoteChannelId && destinationUnitId === unitId
        );
      });
      if (!connected) return undefined;
      const index = notePortGetters
        .filterNoteInputPortUnitItems(unitItems)
        .findIndex((item) => item.unitId === currentNoteChannelId);
      return index >= 0 ? index : undefined;
    }, [currentNoteChannelId, wireConnectionKeys, unitItems, unitId]);
  },
};
