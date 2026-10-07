import { WindowFrame } from "@lib/window-system";
import { useCallback, useLayoutEffect } from "react";
import { Icons } from "@/common/icons";
import { BoardUnitItem, UnitItem } from "@/domain/types";
import {
  getCatalogItem,
  InternalUnitKey,
  interUnitFactories,
} from "@/domain/unit-entries";
import { sourceNoteChannelGetters } from "@/store/source-note-channel-getters";
import { store, windowSystem } from "@/store/store";
import { useUnitStuffReporter } from "@/views/window/unit-stuff-reporter";
import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
import { UnitWindowTitleBarPlaybackButtonContainer } from "@/views/controls/playback-buttons";
import { commonGetters } from "@/store/common-getters";
import { renderLog } from "@lib/utils/render-log";
import { ReactUnitFrameWithLog, UnitFrameScaledExWithLog } from "@lib/wafer-ex";
import { useUnitStuff } from "@/views/unit-card/unit-cards-common";
import { UnitPresetsMenuButton } from "@/views/window/presets-menu";

const useUnitIframeMountedCallback = (unitItem: BoardUnitItem) => {
  return useCallback(
    (iframe: HTMLIFrameElement) => {
      const win = iframe.contentWindow;
      if (win) {
        const onPointerDown = () => {
          windowSystem.setCurrentWindow(unitItem.unitId);
        };
        win.addEventListener("pointerdown", onPointerDown, { capture: true });
        return () =>
          win.removeEventListener("pointerdown", onPointerDown, {
            capture: true,
          });
      }
    },
    [unitItem.unitId],
  );
};

const BoardUnitWindow = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const { unitId, catalogKey } = unitItem;

  const catalogItem = getCatalogItem(catalogKey);
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  const onIframeMounted = useUnitIframeMountedCallback(unitItem);
  const sourceNoteChannelIndex =
    sourceNoteChannelGetters.useUnitSourceActiveNoteChannelIndex(unitId);
  const isPlaybackCapable = unitPlaybackCapabilityFlags[catalogKey] ?? false;
  const viewActive = commonGetters.useWindowVisible(unitId);
  const unitStuff = useUnitStuff(unitId);

  renderLog("BoardUnitWindow", unitId);

  return (
    <WindowFrame
      id={unitId}
      title={catalogItem?.name ?? catalogKey}
      topBarInnerControls={
        <>
          {sourceNoteChannelIndex !== undefined ? (
            <div className="flex-ha gap-2px">
              <span className="text-15px">{sourceNoteChannelIndex + 1}</span>
              <Icons.DirectionRight size={14} />
            </div>
          ) : undefined}
          {isPlaybackCapable && (
            <div className="flex-ha gap-3">
              <UnitWindowTitleBarPlaybackButtonContainer unitId={unitId} />
            </div>
          )}
        </>
      }
      topBarInnerControls2={
        unitStuff?.presetProvider ? (
          <UnitPresetsMenuButton presetProvider={unitStuff.presetProvider} />
        ) : undefined
      }
      // topBarInnerControls2={
      //   <>
      //     {isPlaybackCapable && (
      //       <div className="flex-ha gap-3">
      //         <windowTitleBarControlComponents.ClockActiveButton
      //           active={unitClockingFlags[unitId] !== false}
      //           disabled={soloPlaybackUnitId !== null}
      //           onClick={() => {
      //             actions.toggleUnitClockingFlag(unitId);
      //           }}
      //         />
      //       </div>
      //     )}
      //   </>
      // }
    >
      {catalogItem ? (
        <div className="w-full h-full bg-#ccc">
          <UnitFrameScaledExWithLog
            unitId={unitId}
            unitUrl={catalogItem.loaderPageUrl}
            onIframeMounted={onIframeMounted}
            onUnitInstanceLoaded={reporter.reportLoaded}
            onLoadFailed={reporter.reportFailure}
            viewActive={viewActive}
            fitMode="cover"
            ceilEdge
          />
        </div>
      ) : (
        <div>error: catalog item not found for {catalogKey}</div>
      )}
    </WindowFrame>
  );
};

const EdgeUnitWindow = ({
  unitId,
  internalUnitKey,
}: {
  unitId: string;
  internalUnitKey: InternalUnitKey;
}) => {
  const internalUnitFactory = interUnitFactories[internalUnitKey];
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);

  return (
    <ReactUnitFrameWithLog
      unitId={unitId}
      unitTemplateFn={internalUnitFactory}
      onUnitInstanceLoaded={reporter.reportLoaded}
    />
  );
};

const UnitWindowRoot = ({ unitItem }: { unitItem: UnitItem }) => {
  if (unitItem.type === "board") {
    return <BoardUnitWindow key={unitItem.unitId} unitItem={unitItem} />;
  } else if (unitItem.type === "noteInput") {
    return (
      <EdgeUnitWindow
        key={unitItem.unitId}
        unitId={unitItem.unitId}
        internalUnitKey="noteInputPort"
      />
    );
  } else if (unitItem.type === "speaker") {
    return (
      <EdgeUnitWindow
        key={unitItem.unitId}
        unitId={unitItem.unitId}
        internalUnitKey="speakerPort"
      />
    );
  }
};

export const UnitWindowsRoot = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <>
      {unitItems.map((item) => {
        return <UnitWindowRoot key={item.unitId} unitItem={item} />;
      })}
    </>
  );
};
