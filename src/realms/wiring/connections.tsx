import { Connection } from "wafer-host/react";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";

export const UnitConnectionsRoot = () => {
  const internalSequencerConnectionSpecs =
    notePortGetters.useInternalSequencerConnectionSpecs();
  const { wireConnectionKeys } = store.useSnapshot();
  return (
    <>
      {internalSequencerConnectionSpecs.map((spec) => (
        <Connection
          key={`${spec.source}-${spec.destination}`}
          source={spec.source}
          destination={spec.destination}
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
