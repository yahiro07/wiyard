import { createStore, Store } from "snap-store";
import { defaultScene, defaultWindowPosition } from "@/domain/default-data";
import { UnitItem, UnitStuff } from "@/domain/types";
import { Point } from "@/utils/drag-session";

type StoreState = {
  //will be persisted
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  sharedWindowPosition: Point;
  sequencerWindowPosition: Point;
  currentEffectUnitId: string | null;
  sequencerWindowVisible: boolean;
  currentNoteChannelId: string;
  //not persisted
  unitStuffs: Record<string, UnitStuff>;
  portRelativePositions: Record<string, Point>;
  windowsEvacuated: boolean;
};

// biome-ignore lint/suspicious/noAssignInExpressions: preserve store instance for hmr
export const store = ((window as any).store ??= createStore<StoreState>({
  unitItems: defaultScene.unitItems,
  wireConnectionKeys: [],
  sharedWindowPosition: defaultWindowPosition,
  sequencerWindowPosition: defaultWindowPosition,
  sequencerWindowVisible: false,
  currentEffectUnitId: null,
  currentNoteChannelId: defaultScene.initialNoteChannelId,
  //
  unitStuffs: {},
  portRelativePositions: {},
  windowsEvacuated: false,
})) as Store<StoreState>;

if (0) {
  store.setSequencerWindowVisible(true);
}
