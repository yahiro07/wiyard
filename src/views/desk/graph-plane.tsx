import { desktopTheme } from "@/common/desktop-theme";
import { domIds } from "@/common/dom-ids";
import { store } from "@/store/store";
import { graphPlaneHandlers } from "@/views/desk/graph-plane-handlers";
import { UnitPicker_AddingItem } from "@/views/desk/unit-picker";
import { UnitCardsRoot } from "@/views/unit-card/unit-cards";
import { WireAutomationSwitchersRoot } from "@/views/wiring/wire-automation-switchers";
import { WireKnobsRoot } from "@/views/wiring/wire-knobs";
import { WiringLayer } from "@/views/wiring/wiring-layer";
import { cz } from "@lib/utils/cz";

const GraphPlaneBackground = () => {
  const { graphBgColor, graphBgOpacity } = desktopTheme;
  return (
    <div
      className="size-full pointer-events-none"
      style={{
        background: graphBgColor,
        opacity: graphBgOpacity,
      }}
    />
  );
};

const WireKnobsContainer = () => {
  const { settings } = store.useSnapshot();
  if (!settings.wireVolumeKnobs) return;
  return <WireKnobsRoot />;
};

const GraphPlaneControlButtons = () => {
  return (
    <div className="flex-h gap-2">
      <button onPointerDown={graphPlaneHandlers.handleMoveButtonPointerDown}>
        MV
      </button>
      <button onPointerDown={graphPlaneHandlers.handleScaleButtonPointerDown}>
        SCL
      </button>
    </div>
  );
};

export const GraphPlane = () => {
  const { graphAreaFloatUp, graphSpec } = store.useSnapshot();
  const { planeSize, contentOffset, contentScaling } = graphSpec;
  const scale = contentScaling;
  const trX = planeSize.width / 2 + contentOffset.x;
  const trY = planeSize.height / 2 + contentOffset.y;
  return (
    <div
      id={domIds.graphEditPlane}
      data-board-pan-target="true"
      className={cz(
        "relative rounded-12px overflow-hidden pointer-events-auto",
        graphAreaFloatUp && "z-1",
      )}
      style={{ width: planeSize.width, height: planeSize.height }}
    >
      <GraphPlaneBackground />
      <div
        className="absolute-full pointer-events-none children-pointer-events-auto"
        style={{
          transform: `scale(${scale}) translate(${trX}px, ${trY}px)`,
        }}
      >
        <WiringLayer />
        <WireKnobsContainer />
        <WireAutomationSwitchersRoot />
        <UnitCardsRoot />
        <UnitPicker_AddingItem />
      </div>
      <div className="absolute top-0 right-0 m-2">
        <GraphPlaneControlButtons />
      </div>
    </div>
  );
};

export const GraphPlaneRoot = () => {
  return (
    <div className="absolute-full flex-c justify-center pointer-events-none">
      <GraphPlane />
    </div>
  );
};
