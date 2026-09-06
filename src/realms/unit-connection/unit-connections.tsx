import { Connection } from "wafer-host/react";
import { useNoteInputConnectionViewModels } from "@/realms/unit-connection/unit-connections-models";
import { store } from "@/store/store";
// import { readers } from "@/store/readers";

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
      {/* <Connection source="speakerPort" destination="$output" />  */}
      {false &&
        wireConnectionKeys.map((connectionKey) => {
          const [sourcePortKey, destinationPortKey] = connectionKey.split("-");
          return (
            <Connection
              key={connectionKey}
              source={sourcePortKey}
              destination={destinationPortKey}
            />
          );
        })}
    </>
  );
};
