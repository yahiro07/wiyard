import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { useMemo } from "react";
import {
  connectionsPresenter,
  WireVolumeConnectionSpec,
} from "@/views/wiring/connections-presenter";
import { builtinUnitIds } from "@/domain/unit-entries";
import { ConnectionWithLog } from "@lib/wafer-ex";
import { HeadlessGain, HeadlessPanner } from "@lib/port-units";
import { controlEffectUnitGetters } from "@/store/control-effect-unit-getters";
import { instrumentUnitOutputLevelScales } from "@/domain/showcase-entries";
import { mapVolumeCurveCenterUnity } from "@lib/utils/volume-curve";

const InternalSequencerConnections = () => {
  const internalSequencerConnectionSpecs =
    connectionsPresenter.useInternalSequencerConnectionSpecs();
  return internalSequencerConnectionSpecs.map((spec) => (
    <ConnectionWithLog
      key={spec.connectionKey}
      source={spec.source}
      destination={spec.destination}
    />
  ));
};

const ControlEffectConnections = () => {
  const controlEffectConnectionSpecs =
    connectionsPresenter.useControlEffectUnitConnectionSpecs();
  return controlEffectConnectionSpecs.map((spec) => (
    <ConnectionWithLog
      key={spec.connectionKey}
      source={spec.source}
      destination={spec.destination}
    />
  ));
};

const ControlEffectUnits = () => {
  const targetUnitItems =
    connectionsPresenter.useControlEffectCompatibleUnitItems();
  const { unitControlEffects } = store.useSnapshot();
  return (
    <>
      {targetUnitItems.map((item) => {
        const controlEffect = unitControlEffects[item.unitId];
        const controlEffectUnitId =
          controlEffectUnitGetters.getControlEffectUnitId(item.unitId);
        const volume =
          mapVolumeCurveCenterUnity(controlEffect?.volume ?? 0.5) *
          (instrumentUnitOutputLevelScales[item.catalogKey] ?? 1);
        const pan = controlEffect?.pan ?? 0;
        return (
          <HeadlessPanner
            key={controlEffectUnitId}
            unitId={controlEffectUnitId}
            volume={volume}
            pan={pan}
          />
        );
      })}
    </>
  );
};

let seqWireVolumeUnitIndex = 0;
const WireConnectionWithKnob = ({
  spec,
}: {
  spec: WireVolumeConnectionSpec;
}) => {
  const wireVolumeUnitId = useMemo(() => `wg_${seqWireVolumeUnitIndex++}`, []);
  return (
    <>
      <ConnectionWithLog
        source={spec.source}
        destination={`${wireVolumeUnitId}.audioInput`}
      />
      <HeadlessGain unitId={wireVolumeUnitId} gain={spec.wireGain} />
      <ConnectionWithLog
        source={`${wireVolumeUnitId}.audioOutput`}
        destination={spec.destination}
      />
    </>
  );
};

const BoardItemConnections = () => {
  const boardItemConnectionSpecs =
    connectionsPresenter.useBoardItemConnectionSpecs();
  return boardItemConnectionSpecs.map((spec) => {
    if ("wireGain" in spec) {
      return <WireConnectionWithKnob key={spec.connectionKey} spec={spec} />;
    } else {
      return (
        <ConnectionWithLog
          key={spec.connectionKey}
          source={spec.source}
          destination={spec.destination}
        />
      );
    }
  });
};

const KeyboardConnection = () => {
  const { currentNoteChannelId } = store.useSnapshot();
  const currentSequencerUnitId =
    notePortGetters.getSequencerUnitId(currentNoteChannelId);
  return (
    <ConnectionWithLog
      source={`${builtinUnitIds.keyboard}.noteOutput`}
      destination={`${currentSequencerUnitId}.noteInput`}
    />
  );
};

export const UnitConnectionsRoot = () => {
  return (
    <>
      <InternalSequencerConnections />
      <ControlEffectConnections />
      <ControlEffectUnits />
      <BoardItemConnections />
      <KeyboardConnection />
      <ConnectionWithLog
        source="speakerPort.audioOutput"
        destination="$output"
      />
    </>
  );
};
