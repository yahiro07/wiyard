import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
import { BoardUnitItem, NoteInputPortUnitItem } from "@/domain/types";
import { actions } from "@/store/actions";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { windowTitleBarControlComponents } from "@/views/window/components/window-title-bar-controls";

export const BoardUnitCardPartControlButton = ({
  unitItem,
}: {
  unitItem: BoardUnitItem;
}) => {
  const { unitClockingFlags } = store.useSnapshot();
  const { unitId, catalogKey } = unitItem;
  const isPlaybackCapable = unitPlaybackCapabilityFlags[catalogKey] ?? false;
  if (!isPlaybackCapable) return;
  return (
    <div className="mx-6px">
      <windowTitleBarControlComponents.ClockActiveButton
        active={unitClockingFlags[unitId] !== false}
        onClick={() => {
          actions.toggleUnitClockingFlag(unitId);
        }}
      />
    </div>
  );
};

export const NoteInputPortUnitCardPartControlButton = ({
  unitItem,
}: {
  unitItem: NoteInputPortUnitItem;
}) => {
  const { unitClockingFlags } = store.useSnapshot();
  const sequencerUnitId = notePortGetters.getSequencerUnitId(unitItem.unitId);
  return (
    <div className="mx-6px">
      <windowTitleBarControlComponents.ClockActiveButton
        active={unitClockingFlags[sequencerUnitId] !== false}
        onClick={() => {
          actions.toggleUnitClockingFlag(sequencerUnitId);
        }}
      />
    </div>
  );
};
