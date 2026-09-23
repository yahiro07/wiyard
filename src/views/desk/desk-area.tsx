import { boardSize, domIds } from "@/common/constants";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { actions } from "@/store/actions";
import { sightHandlers, store } from "@/store/store";
import { SecondBar } from "@/views/controls/top-control-bars";
import { CoordDebugLayer } from "@/views/desk/coord-debug-layer";
import { UnitPicker_AddingItem } from "@/views/desk/unit-picker";
import { KeyboardWindow } from "@/views/window/keyboard-window";
import { PianoRollWindow } from "@/views/window/piano-roll-window";
import { UnitWindowsRoot } from "@/views/window/unit-windows";
import { UnitConnectionsRoot } from "@/views/wiring/connections";
import { WireAutomationSwitchersRoot } from "@/views/wiring/wire-automation-switchers";
import { WireKnobsRoot } from "@/views/wiring/wire-knobs";
import { WiringLayer } from "@/views/wiring/wiring-layer";
import { AutomationEditorWindow } from "@/views/window/automation-editor-window";
import { ControlSurfaceWindow } from "@/views/window/control-surface-window";
import { PartControlBarRoot } from "@/views/controls/part-control-bar";
import { PartControlBarRoot2 } from "@/views/controls/part-control-bar-2";
import { UnitCardsRoot } from "@/views/unit-card/unit-cards";
import { InnerDockRoot } from "@/views/desk/dock-root";
import { ControlButtonsInField } from "@/views/controls/control-buttons";
import { SettingsPanelRoot } from "@/views/desk/settings-panel";

const WireKnobsContainer = () => {
  const { settings } = store.useSnapshot();
  if (!settings.wireVolumeKnobs) return;
  return <WireKnobsRoot />;
};

const FieldSightPlaneWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { sight } = store.useSnapshot();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      {children}
    </FieldSightPlane>
  );
};

const GraphEditPlane = () => {
  return (
    <FieldSightPlaneWrapper>
      <div
        id={domIds.graphEditPlane}
        className="h-full"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: "url(/public/dev/bg/bg5.jpg)",
        }}
      >
        <WiringLayer />
        <WireKnobsContainer />
        <WireAutomationSwitchersRoot />
        <UnitCardsRoot />
        <UnitPicker_AddingItem />
        {false && <CoordDebugLayer />}
        <BoardAttachedWindowsPlane />
      </div>
    </FieldSightPlaneWrapper>
  );
};

const InFieldControlUi = () => {
  const { settingsPanelVisible } = store.useSnapshot();
  if (settingsPanelVisible) return;
  return (
    <div className="absolute top-0 right-0 m-6px mt-4">
      <ControlButtonsInField />
    </div>
  );
};

const PartControlBarContainer = () => {
  const { settings } = store.useSnapshot();
  if (!settings.partControlBar) return;
  return <>{1 ? <PartControlBarRoot2 /> : <PartControlBarRoot />}</>;
};

const BoardAttachedWindowsPlane = () => {
  return (
    <>
      <UnitWindowsRoot />
      <PianoRollWindow />
      <AutomationEditorWindow />
      <ControlSurfaceWindow />
      <KeyboardWindow />
    </>
  );
};

const FrontWindowsPlane = () => {
  return (
    <>
      <PartControlBarContainer />
      <InnerDockRoot />
      <SecondBar />
      <InFieldControlUi />
      <SettingsPanelRoot />
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
