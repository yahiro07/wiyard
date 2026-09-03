import { Connection, ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import {
  BoardUnitItem,
  EdgeUnitItem,
  internalUnitSpecs,
  UnitItem,
} from "@/definitions/unit-entries";
import { store } from "@/store/store";
import { useWindowCoordViewModel } from "@/store/view-models";
import {
  deskAreaHandlers,
  unitCardHandlers,
  unitWindowHandlers,
} from "@/ui/desk-area-handlers";
import catalog from "../unit-inventories.json";

const BoardUnitCard = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const catalogItem = catalog[unitItem.catalogKey];
  return (
    <div
      className="absolute"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div
        className="w-200px h-100px bg-white cursor-pointer"
        onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
      >
        <img
          src={catalogItem.thumbnailUrl}
          className="w-full h-full object-contain"
          alt={catalogItem.name}
        />
      </div>
    </div>
  );
};

const EdgeUnitCard = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <div
      className="absolute"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div
        className="w-100px h-100px bg-white/50 flex-c"
        onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
      >
        <internalUnitSpec.iconComponent size={55} />
      </div>
    </div>
  );
};

const UnitCardRoot = ({ unitItem }: { unitItem: UnitItem }) => {
  if (unitItem.type === "board") {
    return <BoardUnitCard unitItem={unitItem} />;
  } else if (unitItem.type === "edge") {
    return <EdgeUnitCard unitItem={unitItem} />;
  }
};

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
  return (
    <div
      className="absolute"
      style={{
        left: windowCoordVm.position.x,
        top: evacuated ? 0 : windowCoordVm.position.y,
        display: isCurrent ? "block" : "none",
      }}
    >
      <div style={{ width: 600 }}>
        <div
          className="bg-gray-500 flex-c py-1 cursor-pointer"
          onPointerDown={(e) =>
            unitWindowHandlers.handleTitleBarPointerDown(e, windowCoordVm)
          }
        >
          {unitItem.unitId}
        </div>
        <div
          className="bg-white/50 text-black"
          style={{ height: 400, display: evacuated ? "none" : "block" }}
        >
          <UnitFrameScaled
            unitId={unitItem.unitId}
            unitUrl={catalog[unitItem.catalogKey].loaderPageUrl}
            // destSpec={unitItem.destSpec}
          />
        </div>
      </div>
    </div>
  );
};

const EdgeUnitWindow = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <ReactUnitFrame
      unitId={unitItem.unitId}
      unitTemplateFn={internalUnitSpec.factory}
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

export const DeskArea = () => {
  const { unitItems, currentEffectUnitId, windowsEvacuated } =
    store.useSnapshot();
  return (
    <div
      className="grow relative bg-gray-400"
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      {unitItems.map((item) => (
        <UnitCardRoot key={item.unitId} unitItem={item} />
      ))}
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
      <Connection source="speakerPort" destination="$output" />
    </div>
  );
};
