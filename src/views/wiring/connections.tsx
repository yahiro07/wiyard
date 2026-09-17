import { HeadlessGain } from "@lib/port-units";
import { Connection } from "wafer-host/react";
import { getWireVolumeUnitId, splitConnectionKey } from "@/domain/port-helpers";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { kKeyboardUnitId } from "@/domain/unit-entries";

const WireConnectionWithGain = ({
  connectionKey,
  level = 0.5,
}: {
  connectionKey: string;
  level?: number;
}) => {
  const [sourcePortKey, destinationPortKey] = splitConnectionKey(connectionKey);
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
  const {
    wireConnectionKeys,
    wireGains,
    wireAutomationParameterIds,
    portStuffs,
    currentNoteChannelId,
  } = store.useSnapshot();
  const currentSequencerUnitId =
    notePortGetters.getSequencerUnitId(currentNoteChannelId);
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
        const [sourcePortKey, destinationPortKey] =
          splitConnectionKey(connectionKey);
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
        } else if (subType === "automation") {
          const paramId = wireAutomationParameterIds[connectionKey];
          if (!paramId) return null;
          const destination = `${destinationPortKey}#${paramId}`;
          return (
            <Connection
              key={connectionKey}
              source={sourcePortKey}
              destination={destination}
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
      <Connection
        source={`${kKeyboardUnitId}.noteOutput`}
        destination={`${currentSequencerUnitId}.noteInput`}
      />
      <Connection source="speakerPort.audioOutput" destination="$output" />
    </>
  );
};
