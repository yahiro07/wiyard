import { WindowFrame } from "@lib/window-system";
import { useCallback, useLayoutEffect } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
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
import { windowTitleBarControlComponents } from "@/views/window/components/window-title-bar-controls";
import { actions } from "@/store/actions";

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
  const { soloPlaybackUnitId, projectLoading } = store.useSnapshot();
  const { unitId, catalogKey } = unitItem;

  const catalogItem = getCatalogItem(catalogKey);
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  const onIframeMounted = useUnitIframeMountedCallback(unitItem);
  const sourceNoteChannelIndex =
    sourceNoteChannelGetters.useUnitSourceActiveNoteChannelIndex(unitId);
  const isPlaybackCapable = unitPlaybackCapabilityFlags[catalogKey] ?? false;

  const { SoloPlaybackButton } = windowTitleBarControlComponents;

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
            <SoloPlaybackButton
              active={unitId === soloPlaybackUnitId}
              disabled={projectLoading}
              onClick={() => {
                actions.toggleSoloPlayback(unitId);
              }}
            />
          )}
        </>
      }
    >
      {catalogItem ? (
        <UnitFrameScaled
          unitId={unitId}
          unitUrl={catalogItem.loaderPageUrl}
          onIframeMounted={onIframeMounted}
          onUnitInstanceLoaded={reporter.reportLoaded}
          onLoadFailed={reporter.reportFailure}
        />
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
    <ReactUnitFrame
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
