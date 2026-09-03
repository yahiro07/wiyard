import { createStore, Store } from "snap-store";
import {
  defaultWindowPosition,
  initialUnitItems,
} from "@/definitions/default-data";
import { UnitItem } from "@/definitions/unit-entries";
import { Point } from "@/utils/drag-session";

type StoreState = {
  unitItems: UnitItem[];
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
  sharedWindowPosition: Point;
};

// biome-ignore lint/suspicious/noAssignInExpressions: preserve store instance for hmr
export const store = ((window as any).store ??= createStore<StoreState>({
  unitItems: initialUnitItems,
  currentEffectUnitId: null,
  windowsEvacuated: false,
  sharedWindowPosition: defaultWindowPosition,
})) as Store<StoreState>;
