import { Connection } from "wafer-host/react";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";

const WireConnectionWithGain = ({
  connectionKey,
}: {
  connectionKey: string;
}) => {
  const [sourcePortKey, destinationPortKey] = connectionKey.split("-");
  return (
    <>
      <Connection
        key={connectionKey}
        source={sourcePortKey}
        destination={destinationPortKey}
      />
    </>
  );
};

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
        return (
          <WireConnectionWithGain
            key={connectionKey}
            connectionKey={connectionKey}
          />
        );
      })}
      <Connection source="speakerPort.audioOutput" destination="$output" />
    </>
  );
};
