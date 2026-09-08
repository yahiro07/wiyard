import { useLayoutEffect } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { BoardUnitItem, EdgeUnitItem, UnitItem } from "@/domain/types";
import { catalog, internalUnitSpecs } from "@/domain/unit-entries";
import { useWindowCoordViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { useUnitStuffReporter } from "@/realms/unit-window/unit-stuff-reporter";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

const BoardUnitWindow = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const { currentEffectUnitId, windowsEvacuated } = store.useSnapshot();
  const isCurrent = unitItem.unitId === currentEffectUnitId;
  const windowCoordVm = useWindowCoordViewModel(unitItem);
  const catalogItem = catalog[unitItem.catalogKey];
  const reporter = useUnitStuffReporter(unitItem.unitId);
  useLayoutEffect(reporter.reportLoadStart, []);

  return (
    <InnerWindow
      title={catalogItem.name}
      windowCoordVm={windowCoordVm}
      displayed={isCurrent}
      evacuated={windowsEvacuated}
      close={() => actions.setCurrentEffectUnitId(null)}
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalogItem.loaderPageUrl}
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
