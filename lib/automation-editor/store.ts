import { useMemo } from "react";
import { Store, createStore } from "snap-store";
import { KnotPoint, LoopBars } from "./types";

type StoreState = {
  points: KnotPoint[];
  loopBars: LoopBars;
  viewActive: boolean;
};
export type AppStore = Store<StoreState>;

const defaultPoints: KnotPoint[] = [
  { x: 0, y: 0, curved: false },
  { x: 1, y: 1, curved: false },
];

export function createAppStore(): AppStore {
  return createStore<StoreState>({
    points: defaultPoints,
    loopBars: 4,
    viewActive: false,
  });
}

export function useStoreAccessor(store: AppStore) {
  return useMemo(() => {
    return {
      getPoints: () => store.state.points,
      usePoints: () => store.useSnapshot().points,
      setPoints: store.setPoints,
    };
  }, [store]);
}
