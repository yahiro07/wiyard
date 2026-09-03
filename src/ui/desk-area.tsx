import React from "react";
import { Connection, ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { appConfig } from "@/definitions/app-config";
import {
  GeneralUnitItem,
  InternalUnitItem,
  internalUnitSpecs,
  UnitItem,
} from "@/definitions/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import {
  useWindowCoordViewModel,
  WindowCoordViewModel,
} from "@/store/view-models";
import { startDragSession } from "@/utils/drag-session";
import catalog from "../unit-inventories.json";

const unitCardHandlers = {
  handlePointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    unitItem: UnitItem,
  ) {
    const unitOriginalPos = unitItem.cardPosition;
    startDragSession(e0.nativeEvent, {
      onMove(e) {
        const deltaX = e.position.x - e.originalPosition.x;
        const deltaY = e.position.y - e.originalPosition.y;
        const newPos = {
          x: unitOriginalPos.x + deltaX,
          y: unitOriginalPos.y + deltaY,
        };
        actions.setUnitCardPosition(unitItem.unitId, newPos);
      },
      onTap() {
        if (unitItem.type === "general") {
          if (store.state.currentEffectUnitId === unitItem.unitId) {
            actions.toggleWindowsEvacuated();
          } else {
            actions.setCurrentEffectUnitId(unitItem.unitId);
            actions.setWindowsEvacuated(false);
          }
        }
      },
    });
  },
};

const GeneralUnitCard = ({ unitItem }: { unitItem: GeneralUnitItem }) => {
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

const InternalUnitCard = ({ unitItem }: { unitItem: InternalUnitItem }) => {
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
  if (unitItem.type === "general") {
    return <GeneralUnitCard unitItem={unitItem} />;
  } else if (unitItem.type === "internal") {
    return <InternalUnitCard unitItem={unitItem} />;
  }
};

const unitWindowHandlers = {
  handleTitleBarPointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    windowCoordVm: WindowCoordViewModel,
  ) {
    const unitOriginalPos = windowCoordVm.position;
    startDragSession(e0.nativeEvent, {
      onMove(e) {
        const deltaX = e.position.x - e.originalPosition.x;
        const deltaY = e.position.y - e.originalPosition.y;
        const newPos = {
          x: unitOriginalPos.x + deltaX,
          y: unitOriginalPos.y + deltaY,
        };
        windowCoordVm.setPosition(newPos);
      },
      onTap() {
        actions.toggleWindowsEvacuated();
      },
    });
  },
};

const GeneralUnitWindow = ({
  unitItem,
  isCurrent,
  evacuated,
}: {
  unitItem: GeneralUnitItem;
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
          style={{
            height: 400,
            display: evacuated ? "none" : "block",
          }}
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

const InternalUnitWindow = ({ unitItem }: { unitItem: InternalUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <ReactUnitFrame
      unitId={unitItem.unitId}
      unitTemplateFn={internalUnitSpec.factory}
    />
  );
};

const deskAreaHandlers = {
  handlePointerDown(e0: React.PointerEvent<HTMLDivElement>) {
    if (e0.currentTarget === e0.target) {
      startDragSession(e0.nativeEvent, {
        onTap() {
          if (appConfig.evacuateWindowsOnTapDesk) {
            actions.toggleWindowsEvacuated();
          }
        },
      });
    }
  },
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
      {unitItems.map((item) =>
        item.type === "general" ? (
          <GeneralUnitWindow
            key={item.unitId}
            unitItem={item}
            isCurrent={item.unitId === currentEffectUnitId}
            evacuated={windowsEvacuated}
          />
        ) : (
          <InternalUnitWindow key={item.unitId} unitItem={item} />
        ),
      )}
      <Connection source="speakerPort" destination="$output" />
    </div>
  );
};
