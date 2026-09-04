import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import {
  BoardUnitItem,
  catalog,
  EdgeUnitItem,
  internalUnitSpecs,
  UnitItem,
} from "@/definitions/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { useWindowCoordViewModel } from "@/store/view-models";
import { InnerWindow } from "@/ui/inner-window";

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
