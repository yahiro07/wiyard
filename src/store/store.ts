import { createStore, Store } from "snap-store";
import { initialUnitItems, UnitItem } from "@/definitions/definitions";

type StoreState = {
  unitItems: UnitItem[];
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
};

// biome-ignore lint/suspicious/noAssignInExpressions: preserve store instance for hmr
export const store = ((window as any).store ??= createStore<StoreState>({
  unitItems: initialUnitItems,
  currentEffectUnitId: null,
  windowsEvacuated: false,
})) as Store<StoreState>;
