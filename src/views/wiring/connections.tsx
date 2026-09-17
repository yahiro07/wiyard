import { HeadlessGain } from "@lib/port-units";
import { Connection } from "wafer-host/react";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { Fragment } from "react";
import { kKeyboardUnitId } from "@/domain/unit-entries";
import { connectionsPresenter } from "@/views/wiring/connections-presenter";

const InternalSequencerConnections = () => {
  const internalSequencerConnectionSpecs =
    connectionsPresenter.useInternalSequencerConnectionSpecs();
  return internalSequencerConnectionSpecs.map((spec) => (
    <Connection
      key={spec.connectionKey}
      source={spec.source}
      destination={spec.destination}
    />
  ));
};

const BoardItemConnections = () => {
  const boardItemConnectionSpecs =
    connectionsPresenter.useBoardItemConnectionSpecs();
  return boardItemConnectionSpecs.map((spec) => {
    if ("wireGain" in spec) {
      return (
        <Fragment key={spec.connectionKey}>
          <Connection
            source={spec.source}
            destination={`${spec.wireVolumeUnitId}.audioInput`}
          />
          <HeadlessGain
            unitId={spec.wireVolumeUnitId}
            destSpec={spec.destination}
            gain={spec.wireGain}
          />
        </Fragment>
      );
    } else {
      return (
        <Connection
          key={spec.connectionKey}
          source={spec.source}
          destination={spec.destination}
        />
      );
    }
  });
};

export const UnitConnectionsRoot = () => {
  const { currentNoteChannelId } = store.useSnapshot();
  const currentSequencerUnitId =
    notePortGetters.getSequencerUnitId(currentNoteChannelId);
  return (
    <>
      <InternalSequencerConnections />
      <BoardItemConnections />
      <Connection
        source={`${kKeyboardUnitId}.noteOutput`}
        destination={`${currentSequencerUnitId}.noteInput`}
      />
      <Connection source="speakerPort.audioOutput" destination="$output" />
    </>
  );
};
