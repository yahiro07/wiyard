import { boardSize, domIds } from "@/common/constants";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { SecondBar } from "@/realms/controls/top-control-bars";
import { CoordDebugLayer } from "@/realms/desk/coord-debug-layer";
import { DockRoot } from "@/realms/desk/dock-root";
import { UnitPicker_AddingItem } from "@/realms/desk/unit-picker";
import { SequencerWindow } from "@/realms/sequencer/sequencer-window";
import { UnitCardsRoot } from "@/realms/unit-card/unit-cards";
import { UnitWindowsRoot } from "@/realms/unit-window/unit-windows";
import { UnitConnectionsRoot } from "@/realms/wiring/connections";
import { WiringLayer } from "@/realms/wiring/wiring-layer";
import { actions } from "@/store/actions";
import { sightHandlers, store } from "@/store/store";

const GraphEditPlane = () => {
  const { sight } = store.useSnapshot();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      <div
        id={domIds.graphEditPlane}
        className="h-full"
        style={{
          // background: uiColors.deskAreaBg,
          background: "#36383a",
          backgroundImage: `url(https://i.imgur.com/tfiVPzS.png)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "280px",
        }}
      >
        <WiringLayer />
        <UnitCardsRoot />
        <UnitPicker_AddingItem />
        {false && <CoordDebugLayer />}
      </div>
    </FieldSightPlane>
  );
};

const FrontWindowsPlane = () => {
  return (
    <>
      <UnitWindowsRoot />
      <SequencerWindow />
      <DockRoot />
      <SecondBar />
    </>
  );
};

export const DeskArea = () => {
  const { projectLoadedIndex } = store.useSnapshot();
  return (
    <div
      // if a new project loaded, refresh all dom elements related to units
      key={projectLoadedIndex}
      id={domIds.deskArea}
      className="grow relative bg-#aca"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).id === domIds.graphEditPlane) {
          sightHandlers.onPointerDown(e.nativeEvent);
          actions.setMenuTargetUnit(null);
        }
      }}
      onWheel={(e) => {
        //temporal wheel scaling support for development
        if ((e.target as HTMLElement).id === domIds.graphEditPlane) {
          sightHandlers.onWheel(e.nativeEvent);
        }
      }}
    >
      <GraphEditPlane />
      <FrontWindowsPlane />
      <UnitConnectionsRoot />
    </div>
  );
};
