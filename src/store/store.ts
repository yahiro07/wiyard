import { createStore, Store } from "snap-store";
import {
  defaultScene,
  defaultWindowPosition,
} from "@/definitions/default-data";
import { UnitItem } from "@/definitions/unit-entries";
import { UnitStuff } from "@/definitions/unit-stuff";
import { Point } from "@/utils/drag-session";

type StoreState = {
  unitItems: UnitItem[];
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
  sharedWindowPosition: Point;
  sequencerWindowVisible: boolean;
  sequencerWindowPosition: Point;
  currentNoteChannelId: string;
  unitStuffs: Record<string, UnitStuff>;
};

// biome-ignore lint/suspicious/noAssignInExpressions: preserve store instance for hmr
export const store = ((window as any).store ??= createStore<StoreState>({
  unitItems: defaultScene.unitItems,
  currentEffectUnitId: null,
  windowsEvacuated: false,
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowVisible: false,
  sequencerWindowPosition: defaultWindowPosition,
  currentNoteChannelId: defaultScene.initialNoteChannelId,
  unitStuffs: {},
})) as Store<StoreState>;

if (0) {
  store.setSequencerWindowVisible(true);
}
