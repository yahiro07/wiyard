import {
  splitConnectionKey,
  decodeWireConnectionKey,
} from "@/domain/port-helpers";
import { BoardUnitItem } from "@/domain/types";
import { controlEffectUnitGetters } from "@/store/control-effect-unit-getters";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { isDefined } from "@lib/utils/general-helper";
import { useMemo } from "react";

type ConnectionSpec = {
  connectionKey: string;
  source: string;
  destination: string;
};

export type WireVolumeConnectionSpec = {
  connectionKey: string;
  source: string;
  destination: string;
  wireGain: number;
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
  useControlEffectCompatibleUnitItems(): BoardUnitItem[] {
    const { unitItems } = store.useSnapshot();
    return unitItems.filter((item) => {
      if (item.type !== "board") return false;
      return controlEffectUnitGetters.isUnitControlEffectCompatible(
        item.catalogKey,
      );
    }) as BoardUnitItem[];
  },
  useControlEffectUnitConnectionSpecs(): ConnectionSpec[] {
    const targetUnitItems = this.useControlEffectCompatibleUnitItems();
    return targetUnitItems
      .map((item) => {
        const controlEffectUnitId =
          controlEffectUnitGetters.getControlEffectUnitId(item.unitId);
        const source = `${item.unitId}.audioOutput`;
        const destination = `${controlEffectUnitId}.audioInput`;
        const connectionKey = `${source}>${destination}`;
        return { connectionKey, source, destination };
      })
      .filter(isDefined());
  },
  useBoardItemConnectionSpecs(): (ConnectionSpec | WireVolumeConnectionSpec)[] {
    const {
      wireConnectionKeys,
      wireGains,
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
            let source = sourcePortKey;
            const { sourceUnitId, sourcePortId, destinationPortKey } =
              decodeWireConnectionKey(connectionKey);
            if (sourcePortId === "audioOutput") {
              source = `${sourceUnitId}_controlEffect.audioOutput`;
            }
            const modConnectionKey = `${source}>${destinationPortKey}`;

            return {
              connectionKey: modConnectionKey,
              source,
              destination: destinationPortKey,
              wireGain: gain,
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
      wireAutomationParameterIds,
      portStuffs,
      currentNoteChannelId,
    ]);
  },
};
