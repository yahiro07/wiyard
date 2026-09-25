import { FieldSightPlane } from "@/components/field-sight-plane";
import { actions } from "@/store/actions";
import { sightHandlers, store } from "@/store/store";
import { SecondBar } from "@/views/controls/top-control-bars";
import { CoordDebugLayer } from "@/views/desk/coord-debug-layer";
import { KeyboardWindow } from "@/views/window/keyboard-window";
import { PianoRollWindow } from "@/views/window/piano-roll-window";
import { UnitWindowsRoot } from "@/views/window/unit-windows";
import { UnitConnectionsRoot } from "@/views/wiring/connections";
import { AutomationEditorWindow } from "@/views/window/automation-editor-window";
import { ControlSurfaceWindow } from "@/views/window/control-surface-window";
import { PartControlBarRoot } from "@/views/controls/part-control-bar";
import { PartControlBarRoot2 } from "@/views/controls/part-control-bar-2";
import { InnerDockRoot } from "@/views/desk/dock-root";
import { ControlButtonsInField } from "@/views/controls/control-buttons";
import { SettingsPanelRoot } from "@/views/desk/settings-panel";
import { DebugOverlay } from "@/views/desk/debug-overlay";
import { desktopTheme } from "@/common/desktop-theme";
import { ScalingGaugeContainer } from "@/views/controls/scaling-gauge";
import { GraphFloatUpButton } from "@/views/controls/graph-area-buttons";
import { domIds } from "@/common/dom-ids";
import { GraphPlaneRoot } from "@/views/graph/graph-plane";
import { cz } from "@lib/utils/cz";
import { appEnvs } from "@/common/app-envs";

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
  const { bgColor, bgImageUrl, bgMix } = desktopTheme;
  return (
    <div
      className="size-full pointer-events-none"
      style={{ background: bgColor }}
    >
      {bgImageUrl && (
        <div
          className="w-full h-full"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${bgImageUrl})`,
            opacity: bgMix,
          }}
        />
      )}
    </div>
  );
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

const DeskBoardPlane = () => {
  return (
    <FieldSightPlaneWrapper>
      <div
        id={domIds.boardPlane}
        className={cz(
          "size-full relative bd-red",
          "[&>div]:(absolute top-0 left-0)",
        )}
      >
        <BoardBackground />
        <GraphPlaneRoot />
        {false && <CoordDebugLayer />}
        <BoardAttachedWindowsPlane />
      </div>
    </FieldSightPlaneWrapper>
  );
};

const _InFieldControlUi = () => {
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
  return <>{0 ? <PartControlBarRoot2 /> : <PartControlBarRoot />}</>;
};

const DeskAreaRightSideControls = () => {
  const { settings } = store.useSnapshot();
  return (
    <div className="absolute-right-center mr-2">
      <div className="flex-va gap-2">
        {settings.graphElevation && <GraphFloatUpButton />}
        <ScalingGaugeContainer />
        {settings.graphElevation && (
          <div className="invisible">
            <GraphFloatUpButton />
          </div>
        )}
      </div>
    </div>
  );
};

const ForegroundUiPlane = () => {
  return (
    <>
      <PartControlBarContainer />
      <InnerDockRoot />
      <SecondBar />
      {/* <InFieldControlUi /> */}
      <DeskAreaRightSideControls />
      <SettingsPanelRoot />
    </>
  );
};

function checkSightTarget(e: React.SyntheticEvent<HTMLDivElement>) {
  const targetEl = e.target as HTMLElement;
  // console.log("checkSightTarget", targetEl);
  return (
    targetEl === e.currentTarget ||
    targetEl.id === domIds.boardPlane ||
    targetEl.dataset.boardPanTarget === "true"
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
          e.stopPropagation();
        }
      }}
      onWheel={(e) => {
        if (store.state.settings.mouseWheelZoom && checkSightTarget(e)) {
          sightHandlers.onWheel(e.nativeEvent);
        }
      }}
    >
      <DeskBoardPlane />
      <ForegroundUiPlane />
      <UnitConnectionsRoot />
      {appEnvs.isDevelopment && <DebugOverlay />}
    </div>
  );
};
