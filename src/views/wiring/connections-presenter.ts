import { splitConnectionKey, getWireVolumeUnitId } from "@/domain/port-helpers";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { useMemo } from "react";

type ConnectionSpec = {
  connectionKey: string;
  source: string;
  destination: string;
};

type WireVolumeConnectionSpec = {
  connectionKey: string;
  source: string;
  destination: string;
  wireVolumeUnitId: string;
  wireGain: number;
  wirePan: number;
};

export const connectionsPresenter = {
  useInternalSequencerConnectionSpecs(): ConnectionSpec[] {
    const noteInputPortUnitItems = notePortGetters.useNoteInputPortUnitItems();
    return useMemo(() => {
      return noteInputPortUnitItems
        .map((item) => {
          const sequencerUnitId = notePortGetters.getSequencerUnitId(
            item.unitId,
          );
          const source = `${sequencerUnitId}.noteOutput`;
          const destination = `${item.unitId}.noteInput`;
          const connectionKey = `${source}>${destination}`;
          return { connectionKey, source, destination };
        })
        .filter(Boolean);
    }, [noteInputPortUnitItems]);
  },
  useBoardItemConnectionSpecs(): (ConnectionSpec | WireVolumeConnectionSpec)[] {
    const {
      wireConnectionKeys,
      wireGains,
      wirePans,
      wireAutomationParameterIds,
      portStuffs,
      currentNoteChannelId,
    } = store.useSnapshot();

    return useMemo(() => {
      return wireConnectionKeys
        .map((connectionKey) => {
          const [sourcePortKey, destinationPortKey] =
            splitConnectionKey(connectionKey);
          const sourcePortStuff = portStuffs[sourcePortKey];
          const subType = sourcePortStuff?.subtype;
          if (destinationPortKey.includes("$output")) {
            //prohibit direct connection to output, it should be connected via speakerPort
            return null;
          }
          if (subType === "audio") {
            const level = wireGains[connectionKey] ?? 0.5;
            const gain = level * 2;
            const pan = wirePans[connectionKey] ?? 0;
            return {
              connectionKey,
              source: sourcePortKey,
              destination: destinationPortKey,
              wireVolumeUnitId: getWireVolumeUnitId(connectionKey),
              wireGain: gain,
              wirePan: pan,
            } satisfies WireVolumeConnectionSpec;
          } else if (subType === "automation") {
            const paramId = wireAutomationParameterIds[connectionKey];
            if (!paramId) return null;
            const destination = `${destinationPortKey}#${paramId}`;
            return {
              connectionKey,
              source: sourcePortKey,
              destination: destination,
            } satisfies ConnectionSpec;
          } else {
            return {
              connectionKey,
              source: sourcePortKey,
              destination: destinationPortKey,
            } satisfies ConnectionSpec;
          }
        })
        .filter(Boolean) as (ConnectionSpec | WireVolumeConnectionSpec)[];
    }, [
      wireConnectionKeys,
      wireGains,
      wirePans,
      wireAutomationParameterIds,
      portStuffs,
      currentNoteChannelId,
    ]);
  },
};
