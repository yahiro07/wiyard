import { Point } from "beams/ax-ui/common-types";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { CatalogKey } from "@/base/showcase-entries";
import {
  createFieldSightHandlers,
  FieldSight,
} from "@/components-ex/field-sight-plane";

export type UnitItem = {
  unitId: string;
  destUnitId?: string;
  catalogKey: CatalogKey;
  position: Point;
};

export type SystemPortUnitItem = {
  unitId: "$output" | "$keyboard";
  destUnitId?: string;
  position: Point;
};

export type StoreState = {
  unitItems: UnitItem[];
  sight: FieldSight;
  keyboardPort: SystemPortUnitItem;
  speakerPort: SystemPortUnitItem;
  notes: number[];
};

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);

export const store = createStore<StoreState>({
  unitItems: [],
  sight: { zoom: -1, eyeOffset: { x: 0, y: 0 } },
  speakerPort: {
    unitId: "$output",
    position: { x: 0, y: 0 },
  },
  keyboardPort: {
    unitId: "$keyboard",
    position: { x: 0, y: 0 },
    destUnitId: undefined,
  },
  notes: [],
});

export const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minZoom: -3, maxZoom: 2 },
);

function buildDefaultScene() {
  const by = 2400;
  const unitItems: UnitItem[] = [
    {
      unitId: "unit1",
      destUnitId: "$output",
      catalogKey: "specbar",
      position: { x: 4300, y: by + 100 },
    },
    {
      unitId: "unit2",
      destUnitId: "unit1",
      catalogKey: "miniSynth",
      position: { x: 4500, y: by + 360 },
    },
    {
      unitId: "unit3",
      destUnitId: "unit2",
      catalogKey: "mu4Keyboard",
      position: { x: 4600, y: by + 620 },
    },
  ];
  store.setUnitItems(unitItems);
  store.patchSpeakerPort({
    position: { x: 4500, y: 2000 },
  });
  store.patchKeyboardPort({
    position: { x: 4500, y: 3500 },
  });
}
buildDefaultScene();
