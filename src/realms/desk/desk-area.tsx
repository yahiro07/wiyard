import { deskAreaHandlers } from "@/presenter/desk-area-handlers";
import { CoordDebugLayer } from "@/realms/desk/coord-debug-layer";
import { DockRoot } from "@/realms/desk/dock-root";
import { UnitPicker_AddingItem } from "@/realms/desk/unit-picker";
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
      style={{
        // background: uiColors.deskAreaBg,
        background: "#36383a",
        backgroundImage: `url(https://i.imgur.com/tfiVPzS.png)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "280px",
      }}
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      <WiringLayer />
      <UnitCardsRoot />
      <UnitWindowsRoot />
      <SequencerWindow />
      <UnitPicker_AddingItem />
      <UnitConnectionsRoot />
      {false && <CoordDebugLayer />}
      {additionalContents}
      <DockRoot />
    </div>
  );
};
