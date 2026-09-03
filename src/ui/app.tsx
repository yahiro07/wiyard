import { HostAppProvider } from "wafer-host/react";
import { createHostSystem } from "wafer-host/core";
import catalog from "../unit-inventories.json";
import { createStore } from "snap-store";
import React from "react";
import { startDragSession } from "@/utils/drag-session";

type CatalogKey = keyof typeof catalog;

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type UnitItem = {
  unitId: string;
  catalogKey: CatalogKey;
  destSpec: string;
  cardPosition: Point;
  windowPosition: Point;
};

const ox = 100;
const oy = 40;
const defaultWindowPosition: Point = { x: -1, y: -1 };
const initialUnitItems: UnitItem[] = [
  {
    unitId: "drum1",
    catalogKey: "js808",
    destSpec: "$output",
    cardPosition: { x: ox + 200, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    unitId: "synth1",
    catalogKey: "webaudioTinysynthMini",
    destSpec: "effect1",
    cardPosition: { x: ox + 500, y: oy + 350 },
    windowPosition: defaultWindowPosition,
  },
  {
    unitId: "effect1",
    catalogKey: "sunsetDelay",
    destSpec: "$output",
    cardPosition: { x: ox + 700, y: oy },
    windowPosition: defaultWindowPosition,
  },
];
initialUnitItems.forEach((item) => {
  item.windowPosition = item.cardPosition;
});

type StoreState = {
  unitItems: UnitItem[];
  currentEffectUnitId: string | null;
};

const store = createStore<StoreState>({
  unitItems: initialUnitItems,
  currentEffectUnitId: null,
});

const actionsInternal = {
  patchUnitAttrs(unitId: string, attrs: Partial<UnitItem>) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
};

const actions = {
  setUnitCardPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { cardPosition: newPos });
  },
  setUnitWindowPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { windowPosition: newPos });
  },
};

const hostSystem = createHostSystem();

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
        className="w-200px h-100px bg-white"
        onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
      >
        <img
          src={catalogItem.thumbnailUrl}
          className="w-full h-full object-contain"
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

const UnitWindow = ({ unitItem }: { unitItem: UnitItem }) => {
  return (
    <div
      className="absolute"
      style={{
        left: unitItem.windowPosition.x,
        top: unitItem.windowPosition.y,
      }}
    >
      <div className="flex-vc">
        <div
          className="w-full bg-gray-500 flex-c py-1"
          onPointerDown={(e) =>
            unitWindowHandlers.handleTitleBarPointerDown(e, unitItem)
          }
        >
          {unitItem.unitId}
        </div>
        <div className="bg-white/50 w-400px h-250px text-black"></div>
      </div>
    </div>
  );
};

const DeskSection = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <div className="bg-sky-300 grow relative">
      {unitItems.map((item) => (
        <UnitCard key={item.unitId} unitItem={item} />
      ))}
      {unitItems.map((item) => (
        <UnitWindow key={item.unitId} unitItem={item} />
      ))}
    </div>
  );
};

export const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <div className="h-dvh flex-v text-white">
        <div className="h-50px bg-gray-500"></div>
        <div className="flex-grow bg-gray-400">
          <DeskSection />
        </div>
      </div>
    </HostAppProvider>
  );
};
