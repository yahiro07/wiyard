import { uiColors } from "@/common/theme";
import { deskAreaHandlers } from "@/presenter/desk-area-handlers";
import { CoordDebugLayer } from "@/realms/desk/coord-debug-layer";
import { SequencerWindow } from "@/realms/sequencer/sequencer-window";
import { UnitCardsRoot } from "@/realms/unit-card/unit-cards";
import { UnitConnectionsRoot } from "@/realms/unit-connection/unit-connections";
import { UnitWindowsRoot } from "@/realms/unit-window/unit-windows";
import { WiringLayer } from "@/realms/wiring/wiring-layer";

export const DeskArea = ({
  additionalContents,
}: {
  additionalContents?: React.ReactNode;
}) => {
  return (
    <div
      id="domDeskArea"
      className="grow relative"
      style={{ background: uiColors.destAreaBg }}
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      <WiringLayer />
      <UnitCardsRoot />
      <UnitWindowsRoot />
      <SequencerWindow />
      <UnitConnectionsRoot />
      {false && <CoordDebugLayer />}
      {additionalContents}
    </div>
  );
};
