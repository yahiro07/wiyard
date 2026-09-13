import { WindowFrame } from "@lib/window-system";
import { useCallback, useLayoutEffect } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { Icons } from "@/common/icons";
import { BoardUnitItem, UnitItem } from "@/domain/types";
import {
  catalog,
  InternalUnitKey,
  internalUnitSpecs,
} from "@/domain/unit-entries";
import { useUnitStuffReporter } from "@/realms/unit-window/unit-stuff-reporter";
import { sourceNoteChannelGetters } from "@/store/source-note-channel-getters";
import { store, windowSystem } from "@/store/store";

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
  const catalogItem = catalog[unitItem.catalogKey];
  const reporter = useUnitStuffReporter(unitItem.unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  const onIframeMounted = useUnitIframeMountedCallback(unitItem);
  const sourceNoteChannelIndex =
    sourceNoteChannelGetters.useUnitSourceActiveNoteChannelIndex(
      unitItem.unitId,
    );

  return (
    <WindowFrame
      id={unitItem.unitId}
      title={catalogItem.name}
      topBarInnerControls={
        sourceNoteChannelIndex !== undefined ? (
          <div className="flex-ha gap-2px">
            <span className="text-15px">{sourceNoteChannelIndex + 1}</span>
            <Icons.DirectionRight size={14} />
          </div>
        ) : undefined
      }
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalogItem.loaderPageUrl}
        onIframeMounted={onIframeMounted}
        onUnitInstanceLoaded={reporter.reportLoaded}
        onLoadFailed={reporter.reportFailure}
      />
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
  const internalUnitSpec = internalUnitSpecs[internalUnitKey];
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);

  return (
    <ReactUnitFrame
      unitId={unitId}
      unitTemplateFn={internalUnitSpec.factory}
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
