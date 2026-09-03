import { createStore } from "snap-store";
import { createHostSystem } from "wafer-host/core";
import catalog from "../unit-inventories.json";

export type CatalogKey = keyof typeof catalog;

type Point = { x: number; y: number };
type Size = { width: number; height: number };

export type UnitItem = {
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
  windowsEvacuated: boolean;
};

export const store = createStore<StoreState>({
  unitItems: initialUnitItems,
  currentEffectUnitId: "drum1",
  windowsEvacuated: false,
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

export const actions = {
  setUnitCardPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { cardPosition: newPos });
  },
  setUnitWindowPosition(unitId: string, newPos: Point) {
    actionsInternal.patchUnitAttrs(unitId, { windowPosition: newPos });
  },
  setCurrentEffectUnitId(unitId: string | null) {
    store.setCurrentEffectUnitId(unitId);
  },
  toggleWindowsEvacuated() {
    store.toggleWindowsEvacuated();
  },
};

export const hostSystem = createHostSystem();
