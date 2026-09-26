import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { Fragment } from "react";
import { connectionsPresenter } from "@/views/wiring/connections-presenter";
import { builtinUnitIds } from "@/domain/unit-entries";
import { ConnectionWithLog } from "@lib/wafer-ex";
import { HeadlessPanner } from "@lib/port-units";

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

const BoardItemConnections = () => {
  const boardItemConnectionSpecs =
    connectionsPresenter.useBoardItemConnectionSpecs();
  return boardItemConnectionSpecs.map((spec) => {
    if ("wireGain" in spec) {
      return (
        <Fragment key={spec.connectionKey}>
          <ConnectionWithLog
            source={spec.source}
            destination={`${spec.wireVolumeUnitId}.audioInput`}
          />
          <HeadlessPanner
            unitId={spec.wireVolumeUnitId}
            destSpec={spec.destination}
            volume={spec.wireGain}
            pan={spec.wirePan}
          />
        </Fragment>
      );
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
      <BoardItemConnections />
      <KeyboardConnection />
      <ConnectionWithLog
        source="speakerPort.audioOutput"
        destination="$output"
      />
    </>
  );
};
