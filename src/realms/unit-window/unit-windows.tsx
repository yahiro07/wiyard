import { useLayoutEffect } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { BoardUnitItem, EdgeUnitItem, UnitItem } from "@/domain/types";
import { catalog, internalUnitSpecs } from "@/domain/unit-entries";
import { useWindowCoordViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { useUnitStuffReporter } from "@/realms/unit-window/unit-stuff-reporter";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

const BoardUnitWindow = ({
  unitItem,
  isCurrent,
  evacuated,
}: {
  unitItem: BoardUnitItem;
  isCurrent: boolean;
  evacuated: boolean;
}) => {
  const windowCoordVm = useWindowCoordViewModel(unitItem);
  const catalogItem = catalog[unitItem.catalogKey];
  const reporter = useUnitStuffReporter(unitItem.unitId);
  useLayoutEffect(reporter.reportLoadStart, []);

  return (
    <InnerWindow
      title={catalogItem.name}
      windowCoordVm={windowCoordVm}
      displayed={isCurrent}
      evacuated={evacuated}
      close={() => actions.setCurrentEffectUnitId(null)}
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalog[unitItem.catalogKey].loaderPageUrl}
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

const UnitWindowRoot = ({
  unitItem,
  currentEffectUnitId,
  windowsEvacuated,
}: {
  unitItem: UnitItem;
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
}) => {
  if (unitItem.type === "board") {
    return (
      <BoardUnitWindow
        key={unitItem.unitId}
        unitItem={unitItem}
        isCurrent={unitItem.unitId === currentEffectUnitId}
        evacuated={windowsEvacuated}
      />
    );
  } else if (unitItem.type === "edge") {
    return <EdgeUnitWindow key={unitItem.unitId} unitItem={unitItem} />;
  } else {
    return null;
  }
};

export const UnitWindowsRoot = () => {
  const { unitItems, currentEffectUnitId, windowsEvacuated } =
    store.useSnapshot();
  return (
    <>
      {unitItems.map((item) => {
        return (
          <UnitWindowRoot
            key={item.unitId}
            unitItem={item}
            currentEffectUnitId={currentEffectUnitId}
            windowsEvacuated={windowsEvacuated}
          />
        );
      })}
    </>
  );
};
