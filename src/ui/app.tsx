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
  position: Point;
};

const ox = 100;
const oy = 40;
const initialUnitItems: UnitItem[] = [
  {
    unitId: "drum1",
    catalogKey: "js808",
    destSpec: "$output",
    position: { x: ox + 200, y: oy },
  },
  {
    unitId: "synth1",
    catalogKey: "webaudioTinysynthMini",
    destSpec: "effect1",
    position: { x: ox + 500, y: oy + 350 },
  },
  {
    unitId: "effect1",
    catalogKey: "sunsetDelay",
    destSpec: "$output",
    position: { x: ox + 700, y: oy },
  },
];

type StoreState = {
  unitItems: UnitItem[];
};

const store = createStore<StoreState>({
  unitItems: initialUnitItems,
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
  setUnitPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { position: newPos });
  },
};

const hostSystem = createHostSystem();

const unitCardHandlers = {
  handlePointerDown(
    e0: React.PointerEvent<HTMLDivElement>,
    unitItem: UnitItem,
  ) {
    const unitOriginalPos = unitItem.position;
    startDragSession(e0.nativeEvent, {
      onMove(e) {
        const deltaX = e.position.x - e.originalPosition.x;
        const deltaY = e.position.y - e.originalPosition.y;
        const newPos = {
          x: unitOriginalPos.x + deltaX,
          y: unitOriginalPos.y + deltaY,
        };
        actions.setUnitPosition(unitItem.unitId, newPos);
      },
    });
  },
};

const UnitCard = ({ unitItem }: { unitItem: UnitItem }) => {
  const active = false;
  const catalogItem = catalog[unitItem.catalogKey];
  return (
    <div
      className="absolute w-200px h-100px bg-white"
      style={{
        left: unitItem.position.x,
        top: unitItem.position.y,
      }}
      onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    >
      <img
        src={catalogItem.thumbnailUrl}
        className="w-full h-full object-contain"
      />
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
