import { HeadlessGain } from "@lib/port-units";
import { Connection } from "wafer-host/react";
import { getWireVolumeUnitId } from "@/domain/port-helpers";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";

const WireConnectionWithGain = ({
  connectionKey,
  level = 0.5,
}: {
  connectionKey: string;
  level?: number;
}) => {
  const [sourcePortKey, destinationPortKey] = connectionKey.split("-");
  const wireVolumeUnitId = getWireVolumeUnitId(connectionKey);
  const gain = level * 2;
  return (
    <>
      <Connection
        key={connectionKey}
        source={sourcePortKey}
        destination={`${wireVolumeUnitId}.audioInput`}
      />
      <HeadlessGain
        unitId={wireVolumeUnitId}
        destSpec={destinationPortKey}
        gain={gain}
      />
    </>
  );
};

export const UnitConnectionsRoot = () => {
  const internalSequencerConnectionSpecs =
    notePortGetters.useInternalSequencerConnectionSpecs();
  const { wireConnectionKeys, wireGains, portStuffs } = store.useSnapshot();
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
        const sourcePortStuff = portStuffs[sourcePortKey];
        const subType = sourcePortStuff?.subtype;
        if (destinationPortKey.includes("$output")) {
          //prohibit direct connection to output, it should be connected via speakerPort
          return null;
        }
        if (subType === "audio") {
          return (
            <WireConnectionWithGain
              key={connectionKey}
              connectionKey={connectionKey}
              level={wireGains[connectionKey]}
            />
          );
        } else {
          return (
            <Connection
              key={connectionKey}
              source={sourcePortKey}
              destination={destinationPortKey}
            />
          );
        }
      })}
      <Connection source="speakerPort.audioOutput" destination="$output" />
    </>
  );
};
