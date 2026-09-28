import { uiTheme } from "@/common/ui-theme";
import { domIds } from "@/common/dom-ids";
import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { graphPlaneHandlers } from "@/views/graph/graph-plane-handlers";
import { UnitPicker_AddingItem } from "@/views/desk/unit-picker";
import { UnitCardsRoot } from "@/views/unit-card/unit-cards";
import { cz } from "@lib/utils/cz";
import { WiringLayersRoot } from "@/views/wiring/wiring-layers-root";
import { appEnvs } from "@/common/app-envs";

const useGraphAreaElevated = () => {
  const { settings, graphAreaElevated } = store.useSnapshot();
  return settings.graphElevation && graphAreaElevated;
};

const GraphPlaneBackgroundBoardBg = () => {
  const { boardSize, graphSpec } = store.useSnapshot();
  const { boardBgColor, boardBgImageUrl, boardBgMix } = uiTheme;

  const bgTx = graphSpec.planeSize.width / 2 - boardSize.width / 2;
  const bgTy = graphSpec.planeSize.height / 2 - boardSize.height / 2;
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        width: boardSize.width,
        height: boardSize.height,
        background: boardBgColor,
        transform: `translate(${bgTx}px, ${bgTy}px)`,
      }}
    >
      {boardBgImageUrl && (
        <div
          className="w-full h-full"
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundImage: `url(${boardBgImageUrl})`,
            opacity: boardBgMix,
          }}
        />
      )}
    </div>
  );
};

const GraphPlaneBackground = () => {
  const { settings } = store.useSnapshot();
  const graphAreaElevated = useGraphAreaElevated();
  const { graphBgColor, graphBgOpacity } = uiTheme;
  return (
    <div className="size-full rounded-12px relative overflow-hidden">
      {graphAreaElevated && settings.graphElevationUnderlay === "solid" && (
        <GraphPlaneBackgroundBoardBg />
      )}
      <div
        className="absolute-full"
        style={{ background: graphBgColor, opacity: graphBgOpacity }}
      />
    </div>
  );
};

const GraphPlaneControlButtons = () => {
  const { graphSpec } = store.useSnapshot();
  const buttonClass = "hover:opacity-80";
  return (
    <div className="absolute top-0 right-0 m-2">
      <div className="flex-ha gap-2">
        <div>
          <button
            className={buttonClass}
            onPointerDown={graphPlaneHandlers.handleMoveButtonPointerDown}
          >
            <Icons.Move size={20} />
          </button>
        </div>
        <div className="relative">
          <button
            className={buttonClass}
            onPointerDown={graphPlaneHandlers.handleScaleButtonPointerDown}
          >
            <Icons.Resize size={24} />
          </button>
          {appEnvs.isDevelopment && (
            <div className="absolute left-50% top-22px -translate-x-1/2 text-9px">
              {Math.round(graphSpec.contentScaling * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GraphPlaneResizeAnchor = () => {
  return (
    <button className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
      <div
        className="w-20px h-20px cursor-nwse-resize"
        onPointerDown={graphPlaneHandlers.handlePlaneResizeAnchorPointerDown}
      />
    </button>
  );
};

export const GraphPlane = () => {
  const { graphSpec } = store.useSnapshot();
  const graphAreaElevated = useGraphAreaElevated();

  const { planeSize, contentOffset, contentScaling } = graphSpec;
  const scale = contentScaling;
  const tr1x = planeSize.width / 2;
  const tr1y = planeSize.height / 2;
  const tr2x = contentOffset.x * scale;
  const tr2y = contentOffset.y * scale;
  return (
    <div
      data-board-pan-target="true"
      className={cz(
        "relative",
        graphAreaElevated &&
          "z-1 pointer-events-auto children-pointer-events-none",
      )}
      style={{ width: planeSize.width, height: planeSize.height }}
    >
      <GraphPlaneBackground />
      <div className="absolute-full overflow-hidden">
        <div
          style={{
            transform: `translate(${tr1x}px, ${tr1y}px)`,
            transformOrigin: "top left",
          }}
        >
          <div
            className="h-1px children-pointer-events-auto"
            style={{
              transform: `translate(${tr2x}px, ${tr2y}px) scale(${scale})`,
              transformOrigin: "top left",
            }}
            id={domIds.graphEditPlane}
          >
            <WiringLayersRoot />
            <UnitCardsRoot />
            <UnitPicker_AddingItem />
          </div>
        </div>
      </div>
      <div className="children-pointer-events-auto">
        <GraphPlaneControlButtons />
        <GraphPlaneResizeAnchor />
      </div>
    </div>
  );
};

const GraphPlaneElevationFrostedGlass = () => {
  const { boardSize, graphSpec } = store.useSnapshot();
  const {
    planeSize: { width, height },
  } = graphSpec;
  const cx = boardSize.width / 2;
  const cy = boardSize.height / 2;
  return (
    <div
      data-board-pan-target="true"
      className="absolute z-1"
      style={{
        left: cx - width / 2,
        top: cy - height / 2,
        width,
        height,
        backdropFilter: "blur(4px)",
      }}
    />
  );
};

const GraphPlaneElevationFrostedGlassContainer = () => {
  const { settings, graphAreaElevated } = store.useSnapshot();
  if (
    !(
      settings.graphElevation &&
      settings.graphElevationUnderlay === "frosted" &&
      graphAreaElevated
    )
  )
    return;
  return <GraphPlaneElevationFrostedGlass />;
};

export const GraphPlaneRoot = () => {
  return (
    <>
      <GraphPlaneElevationFrostedGlassContainer />
      <div className="absolute-full flex-c justify-center pointer-events-none">
        <GraphPlane />
      </div>
    </>
  );
};
