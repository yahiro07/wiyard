import { useMemo } from "react";
import { IconType } from "react-icons";
import { EdgeUnitItem, internalUnitSpecs } from "@/definitions/unit-entries";
import { store } from "@/store/store";
import { unitCardHandlers } from "@/ui/desk-area-handlers";

export type EdgeUnitCardViewModel = {
  unitItem: EdgeUnitItem;
  highlighted: boolean;
  iconComponent: IconType;
  label: string;
  handlePointerDown?(e: React.PointerEvent<HTMLDivElement>): void;
};

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

export function useEdgeUnitCardViewModel_NoteInputPort(
  unitItem: EdgeUnitItem,
): EdgeUnitCardViewModel {
  const { currentNoteChannelId } = store.useSnapshot();
  const index = useNoteOutputPortIndex(unitItem.noteChannelId);
  const isCurrent = unitItem.noteChannelId === currentNoteChannelId;
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return {
    unitItem,
    highlighted: isCurrent,
    iconComponent: internalUnitSpec.iconComponent,
    label: `input ${index + 1}`,
    handlePointerDown(e) {
      unitCardHandlers.handlePointerDown(e, unitItem);
    },
  };
}

export function useEdgeUnitCardViewModel_SpeakerPort(
  unitItem: EdgeUnitItem,
): EdgeUnitCardViewModel {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return {
    unitItem,
    highlighted: false,
    iconComponent: internalUnitSpec.iconComponent,
    label: "output",
    handlePointerDown(e) {
      unitCardHandlers.handlePointerDown(e, unitItem);
    },
  };
}
