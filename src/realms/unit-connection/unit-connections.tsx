import { Connection } from "wafer-host/react";
import { useNoteInputConnectionViewModels } from "@/realms/unit-connection/unit-connections-models";
import { store } from "@/store/store";

export const UnitConnectionsRoot = () => {
  const noteInputConnectionViewModels = useNoteInputConnectionViewModels();
  const { wireConnectionKeys } = store.useSnapshot();
  return (
    <>
      {noteInputConnectionViewModels.map((vm) => (
        <Connection
          key={`${vm.source}-${vm.destination}`}
          source={vm.source}
          destination={vm.destination}
        />
      ))}
      {wireConnectionKeys.map((connectionKey) => {
        const [sourcePortKey, destinationPortKey] = connectionKey.split("-");
        return (
          <Connection
            key={connectionKey}
            source={sourcePortKey}
            destination={destinationPortKey}
          />
        );
      })}
      <Connection source="speakerPort.audioOutput" destination="$output" />
    </>
  );
};
