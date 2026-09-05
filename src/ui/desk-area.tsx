import { store } from "@/store/store";
import { deskAreaHandlers } from "@/ui/desk-area-handlers";
import { SequencerWindow } from "@/ui/sequencer-window";
import { TaskBar } from "@/ui/task-bar";
import { UnitCardsRoot } from "@/ui/unit-cards";
import { UnitConnectionsRoot } from "@/ui/unit-connections";
import { UnitWindowsRoot } from "@/ui/unit-windows";

export const DeskArea = () => {
  const { windowsEvacuated, sequencerWindowVisible } = store.useSnapshot();
  return (
    <div
      className="grow relative bg-gray-500"
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      <TaskBar />
      <UnitCardsRoot />
      <UnitWindowsRoot />
      <SequencerWindow
        visible={sequencerWindowVisible}
        evacuated={windowsEvacuated}
      />
      <UnitConnectionsRoot />
    </div>
  );
};
