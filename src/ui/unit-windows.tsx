import { useEffect } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import {
  BoardUnitItem,
  catalog,
  EdgeUnitItem,
  internalUnitSpecs,
  UnitItem,
} from "@/definitions/unit-entries";
import { buildUnitStuffLoaded } from "@/presenter/unit-stuff-builder";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { useWindowCoordViewModel } from "@/store/view-models";
import { InnerWindow } from "@/ui/inner-window";

function useUnitStuffReporter(unitId: string) {
  const reportLoadStart = () => {
    actions.setUnitStuff(unitId, { status: "loading" });
    return () => {
      actions.setUnitStuff(unitId, null);
    };
  };
  const reportLoaded = (unitInstance: HsUnitInstance) => {
    const unitStuffLoaded = buildUnitStuffLoaded(unitInstance);
    actions.setUnitStuff(unitId, unitStuffLoaded);
  };
  const reportFailure = () => {
    actions.setUnitStuff(unitId, { status: "error" });
  };

  return { reportLoadStart, reportLoaded, reportFailure };
}

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
  useEffect(reporter.reportLoadStart, []);

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
        destSpec={unitItem._destUnitId}
        onUnitInstanceLoaded={reporter.reportLoaded}
        onLoadFailed={reporter.reportFailure}
      />
    </InnerWindow>
  );
};

const EdgeUnitWindow = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <ReactUnitFrame
      unitId={unitItem.unitId}
      unitTemplateFn={internalUnitSpec.factory}
      destSpec={unitItem._destUnitId}
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
