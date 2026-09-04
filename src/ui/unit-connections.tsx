import { useMemo } from "react";
import { Connection } from "wafer-host/react";
import { store } from "@/store/store";

type NoteInputConnectionViewModel = {
  source: string;
  destination: string;
};
function useNoteInputConnectionViewModels(): NoteInputConnectionViewModel[] {
  const { unitItems } = store.useSnapshot();
  return useMemo(() => {
    return unitItems
      .filter((item) => item.type === "offStage")
      .map((item) => {
        const noteChannelId = item.noteChannelId;
        const destUnitItem = unitItems.find(
          (item) =>
            item.type === "edge" &&
            item.internalUnitKey === "noteInputPort" &&
            item.noteChannelId === noteChannelId,
        );
        if (!destUnitItem) return undefined;
        const source = `${item.unitId}.noteOutput`;
        const destination = `${destUnitItem.unitId}.noteInput`;
        return { source, destination };
      })
      .filter(Boolean) as NoteInputConnectionViewModel[];
  }, [unitItems]);
}

export const UnitConnectionsRoot = () => {
  const noteInputConnectionViewModels = useNoteInputConnectionViewModels();
  return (
    <>
      {noteInputConnectionViewModels.map((vm) => (
        <Connection
          key={`${vm.source}-${vm.destination}`}
          source={vm.source}
          destination={vm.destination}
        />
      ))}
      {/* <Connection source="speakerPort" destination="$output" />  */}
    </>
  );
};
