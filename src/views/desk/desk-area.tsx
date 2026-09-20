import { boardSize, domIds } from "@/common/constants";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { actions } from "@/store/actions";
import { sightHandlers, store } from "@/store/store";
import { SecondBar } from "@/views/controls/top-control-bars";
import { CoordDebugLayer } from "@/views/desk/coord-debug-layer";
import { DockRoot } from "@/views/window/dock-root";
import { UnitPicker_AddingItem } from "@/views/desk/unit-picker";
import { KeyboardWindow } from "@/views/window/keyboard-window";
import { PianoRollWindow } from "@/views/window/piano-roll-window";
import { UnitCardsRoot } from "@/views/unit-card/unit-cards";
import { UnitWindowsRoot } from "@/views/window/unit-windows";
import { UnitConnectionsRoot } from "@/views/wiring/connections";
import { WireAutomationSwitchersRoot } from "@/views/wiring/wire-automation-switchers";
import { WireKnobsRoot } from "@/views/wiring/wire-knobs";
import { WiringLayer } from "@/views/wiring/wiring-layer";
import { AutomationEditorWindow } from "@/views/window/automation-editor-window";
import { ControlSurfaceWindow } from "@/views/window/control-surface-window";
import { PartControlBarRoot } from "@/views/controls/part-control-bar";

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
        <WireKnobsRoot />
        <WireAutomationSwitchersRoot />
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
      <PianoRollWindow />
      <AutomationEditorWindow />
      <ControlSurfaceWindow />
      <KeyboardWindow />
      <PartControlBarRoot />
      <DockRoot />
      <SecondBar />
    </>
  );
};

function checkSightTarget(e: React.SyntheticEvent<HTMLDivElement>) {
  return (
    e.target === e.currentTarget ||
    (e.target as HTMLElement).id === domIds.graphEditPlane
  );
}

export const DeskArea = () => {
  const { projectLoadedIndex } = store.useSnapshot();
  return (
    <div
      // if a new project loaded, refresh all dom elements related to units
      key={projectLoadedIndex}
      id={domIds.deskArea}
      className="grow relative bg-#808488 overflow-hidden"
      onPointerDown={(e) => {
        if (checkSightTarget(e)) {
          sightHandlers.onPointerDown(e.nativeEvent);
          actions.setMenuTargetUnit(null);
        }
      }}
      // onWheel={(e) => {
      // if (checkSightTarget(e)) {
      // sightHandlers.onWheel(e.nativeEvent);
      // }
      // }}
    >
      <GraphEditPlane />
      <FrontWindowsPlane />
      <UnitConnectionsRoot />
    </div>
  );
};
