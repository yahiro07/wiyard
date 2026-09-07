import { deskAreaHandlers } from "@/presenter/desk-area-handlers";
import { CoordDebugLayer } from "@/realms/desk/coord-debug-layer";
import { TaskBar } from "@/realms/desk/task-bar";
import { SequencerWindow } from "@/realms/sequencer/sequencer-window";
import { UnitCardsRoot } from "@/realms/unit-card/unit-cards";
import { UnitConnectionsRoot } from "@/realms/unit-connection/unit-connections";
import { UnitWindowsRoot } from "@/realms/unit-window/unit-windows";
import { WiringLayer } from "@/realms/wiring/wiring-layer";
import { store } from "@/store/store";

export const DeskArea = () => {
  const { windowsEvacuated, sequencerWindowVisible } = store.useSnapshot();
  return (
    <div
      className="grow relative bg-gray-500/80"
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      <TaskBar />
      <WiringLayer />
      <UnitCardsRoot />
      <UnitWindowsRoot />
      <SequencerWindow
        visible={sequencerWindowVisible}
        evacuated={windowsEvacuated}
      />
      <UnitConnectionsRoot />
      {false && <CoordDebugLayer />}
    </div>
  );
};
