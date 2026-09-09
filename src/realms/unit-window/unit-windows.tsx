import { useLayoutEffect } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { BoardUnitItem, EdgeUnitItem, UnitItem } from "@/domain/types";
import { catalog, internalUnitSpecs } from "@/domain/unit-entries";
import { useWindowCoordViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { useUnitStuffReporter } from "@/realms/unit-window/unit-stuff-reporter";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { useInstance } from "@/utils/hooks";

function createBoardUnitWindowViewModel(unitItem: BoardUnitItem) {
  return {
    onIframeMounted(iframe: HTMLIFrameElement) {
      const win = iframe.contentWindow;
      if (win) {
        const onPointerDown = () => {
          actions.setCurrentWindowUnitId(unitItem.unitId);
        };
        win.addEventListener("pointerdown", onPointerDown, { capture: true });
        return () =>
          win.removeEventListener("pointerdown", onPointerDown, {
            capture: true,
          });
      }
    },
  };
}

const BoardUnitWindow = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const { windowsEvacuated, currentWindowUnitId } = store.useSnapshot();
  const isCurrent = unitItem.unitId === currentWindowUnitId;
  const windowCoordVm = useWindowCoordViewModel(unitItem);
  const catalogItem = catalog[unitItem.catalogKey];
  const reporter = useUnitStuffReporter(unitItem.unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  const vm = useInstance(() => createBoardUnitWindowViewModel(unitItem));

  return (
    <InnerWindow
      title={catalogItem.name}
      windowCoordVm={windowCoordVm}
      evacuated={windowsEvacuated}
      close={() => actions.setUnitWindowStatus(unitItem.unitId, "none")}
      toggleMinimized={() => actions.toggleWindowMinimized(unitItem.unitId)}
      isCurrent={isCurrent}
      windowStatus={unitItem.windowStatus}
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalogItem.loaderPageUrl}
        onIframeMounted={vm.onIframeMounted}
        onUnitInstanceLoaded={reporter.reportLoaded}
        onLoadFailed={reporter.reportFailure}
      />
    </InnerWindow>
  );
};

const EdgeUnitWindow = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  const reporter = useUnitStuffReporter(unitItem.unitId);
  useLayoutEffect(reporter.reportLoadStart, []);

  return (
    <ReactUnitFrame
      unitId={unitItem.unitId}
      unitTemplateFn={internalUnitSpec.factory}
      onUnitInstanceLoaded={reporter.reportLoaded}
    />
  );
};

const UnitWindowRoot = ({ unitItem }: { unitItem: UnitItem }) => {
  if (unitItem.type === "board") {
    return <BoardUnitWindow key={unitItem.unitId} unitItem={unitItem} />;
  } else if (unitItem.type === "edge") {
    return <EdgeUnitWindow key={unitItem.unitId} unitItem={unitItem} />;
  } else {
    return null;
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
