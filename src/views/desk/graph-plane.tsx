import { desktopTheme } from "@/common/desktop-theme";
import { domIds } from "@/common/dom-ids";
import { store } from "@/store/store";
import { UnitPicker_AddingItem } from "@/views/desk/unit-picker";
import { UnitCardsRoot } from "@/views/unit-card/unit-cards";
import { WireAutomationSwitchersRoot } from "@/views/wiring/wire-automation-switchers";
import { WireKnobsRoot } from "@/views/wiring/wire-knobs";
import { WiringLayer } from "@/views/wiring/wiring-layer";
import { cz } from "@lib/utils/cz";

const GraphBackgroundPlane = () => {
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

export const GraphEditPlane = () => {
  const { graphAreaFloatUp, graphSpec } = store.useSnapshot();
  const { planeSize } = graphSpec;
  return (
    <div
      id={domIds.graphEditPlane}
      data-board-pan-target="true"
      className={cz(
        "relative rounded-12px overflow-hidden pointer-events-auto",
        graphAreaFloatUp && "z-1",
      )}
      style={{
        width: planeSize.width,
        height: planeSize.height,
      }}
    >
      <GraphBackgroundPlane />
      <div
        className="absolute-full pointer-events-none children-pointer-events-auto"
        style={{
          transform: `translate(${planeSize.width / 2}px, ${planeSize.height / 2}px)`,
        }}
      >
        <WiringLayer />
        <WireKnobsContainer />
        <WireAutomationSwitchersRoot />
        <UnitCardsRoot />
        <UnitPicker_AddingItem />
      </div>
    </div>
  );
};

export const GraphPlaneRoot = () => {
  return (
    <div className="absolute-full flex-c justify-center pointer-events-none">
      <GraphEditPlane />
    </div>
  );
};
