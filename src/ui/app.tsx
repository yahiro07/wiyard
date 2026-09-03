import React from "react";
import { HostAppProvider } from "wafer-host/react";
import { actions, hostSystem, store, UnitItem } from "@/ui/store";
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
        actions.setCurrentEffectUnitId(unitItem.unitId);
        actions.endWindowsEvacuation();
      },
    });
  },
};

const UnitCard = ({ unitItem }: { unitItem: UnitItem }) => {
  const active = false;
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

const unitWindowHandlers = {
  handleTitleBarPointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    unitItem: UnitItem,
  ) {
    const unitOriginalPos = unitItem.windowPosition;
    startDragSession(e0.nativeEvent, {
      onMove(e) {
        const deltaX = e.position.x - e.originalPosition.x;
        const deltaY = e.position.y - e.originalPosition.y;
        const newPos = {
          x: unitOriginalPos.x + deltaX,
          y: unitOriginalPos.y + deltaY,
        };
        actions.setUnitWindowPosition(unitItem.unitId, newPos);
      },
    });
  },
};

const UnitWindow = ({
  unitItem,
  isCurrent,
  evacuated,
}: {
  unitItem: UnitItem;
  isCurrent: boolean;
  evacuated: boolean;
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: unitItem.windowPosition.x,
        top: evacuated ? 0 : unitItem.windowPosition.y,
        display: isCurrent ? "block" : "none",
      }}
    >
      <div style={{ width: 600 }}>
        <div
          className="bg-gray-500 flex-c py-1 cursor-pointer"
          onPointerDown={(e) =>
            unitWindowHandlers.handleTitleBarPointerDown(e, unitItem)
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
        ></div>
      </div>
    </div>
  );
};

const deskAreaHandlers = {
  handlePointerDown(e0: React.PointerEvent<HTMLDivElement>) {
    if (e0.currentTarget === e0.target) {
      actions.toggleWindowsEvacuated();
    }
  },
};

const DeskArea = () => {
  const { unitItems, currentEffectUnitId, windowsEvacuated } =
    store.useSnapshot();
  return (
    <div
      className="grow relative bg-gray-400"
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      {unitItems.map((item) => (
        <UnitCard key={item.unitId} unitItem={item} />
      ))}
      {unitItems.map((item) => (
        <UnitWindow
          key={item.unitId}
          unitItem={item}
          isCurrent={item.unitId === currentEffectUnitId}
          evacuated={windowsEvacuated}
        />
      ))}
    </div>
  );
};

export const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <div className="h-dvh flex-v text-white">
        <div className="h-50px bg-gray-600"></div>
        <DeskArea />
      </div>
    </HostAppProvider>
  );
};
