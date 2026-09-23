import { domIds } from "@/common/constants";
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
import { DebugOverlay } from "@/views/desk/debug-overlay";
import { graphAreaSize } from "@/project/default-data";

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
  const { sight, boardSize } = store.useSnapshot();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      {children}
    </FieldSightPlane>
  );
};

const BoardBackground = () => {
  const bgImageUrl = "/dev/bg/bg18.jpg";
  if (1) {
    const bgColor = "#006";
    const bgMix = 0.3;
    return (
      <div
        className="absolute-full pointer-events-none"
        style={{ background: bgColor }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${bgImageUrl})`,
            opacity: bgMix,
          }}
        />
      </div>
    );
  } else {
    const bgCoverColor = "#006";
    const bgCoverOpacity = 0.7;
    return (
      <div
        className="absolute-full pointer-events-none"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${bgImageUrl})`,
        }}
      >
        <div
          className="w-full h-full"
          style={{ background: bgCoverColor, opacity: bgCoverOpacity }}
        />
      </div>
    );
  }
};

const BoardAttachedWindowsPlane = () => {
  const { boardSize } = store.useSnapshot();
  return (
    <div
      style={{
        transform: `translate(${boardSize.width / 2}px, ${boardSize.height / 2}px)`,
      }}
    >
      <UnitWindowsRoot />
      <PianoRollWindow />
      <AutomationEditorWindow />
      <ControlSurfaceWindow />
      <KeyboardWindow />
    </div>
  );
};

const GraphBackgroundPlane = () => {
  const configs = {
    // graphBgColor: "#fff2",
    // graphBgColor: "#444",
    graphBgColor: "#0044",
  };
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: graphAreaSize.width,
        height: graphAreaSize.height,
        background: configs.graphBgColor,
        borderRadius: "12px",
      }}
    />
  );
};

const GraphEditPlane = () => {
  const { boardSize } = store.useSnapshot();
  return (
    <div
      id={domIds.graphEditPlane}
      style={{
        transform: `translate(${boardSize.width / 2}px, ${boardSize.height / 2}px)`,
      }}
    >
      <GraphBackgroundPlane />
      <WiringLayer />
      <WireKnobsContainer />
      <WireAutomationSwitchersRoot />
      <UnitCardsRoot />
      <UnitPicker_AddingItem />
    </div>
  );
};

const DeskBoardPlane = () => {
  return (
    <FieldSightPlaneWrapper>
      <div id={domIds.boardPlane} className="h-full">
        <BoardBackground />
        <GraphEditPlane />
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
    <div className="absolute-right-center m-6px">
      <ControlButtonsInField />
    </div>
  );
};

const PartControlBarContainer = () => {
  const { settings } = store.useSnapshot();
  if (!settings.partControlBar) return;
  return <>{1 ? <PartControlBarRoot2 /> : <PartControlBarRoot />}</>;
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
    (e.target as HTMLElement).id === domIds.boardPlane
  );
}

export const DeskArea = () => {
  const { projectLoadedIndex } = store.useSnapshot();
  return (
    <div
      // if a new project loaded, refresh all dom elements related to units
      key={projectLoadedIndex}
      // id={domIds.deskArea}
      className="grow relative bg-#808488 overflow-hidden"
      onPointerDown={(e) => {
        if (checkSightTarget(e)) {
          sightHandlers.onPointerDown(e.nativeEvent);
          actions.setMenuTargetUnit(null);
        }
      }}
      onWheel={(e) => {
        if (store.state.settings.mouseWheelZoom && checkSightTarget(e)) {
          sightHandlers.onWheel(e.nativeEvent);
        }
      }}
    >
      <DeskBoardPlane />
      <FrontWindowsPlane />
      <UnitConnectionsRoot />
      <DebugOverlay />
    </div>
  );
};
