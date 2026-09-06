import { createStore, Store } from "snap-store";
import { defaultScene, defaultWindowPosition } from "@/domain/default-data";
import { PortStuff, UnitItem, UnitStuff } from "@/domain/types";
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
  portStuffs: Record<string, PortStuff>;
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
  portStuffs: {},
  windowsEvacuated: false,
})) as Store<StoreState>;

if (0) {
  store.setSequencerWindowVisible(true);
}
