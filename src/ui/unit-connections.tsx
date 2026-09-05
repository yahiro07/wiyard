import { Connection } from "wafer-host/react";
import { useNoteInputConnectionViewModels } from "@/ui/unit-connections-models";

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
