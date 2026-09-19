import { createContext, ReactNode, useContext, useMemo } from "react";
import { UnitInterface } from "wafer-host/unit-types";
import { AppStore } from "./store";

export const AppContext = createContext<{
  store: AppStore;
  unitInterface: UnitInterface;
}>(null as any);

export const AppProvider = ({
  children,
  store,
  unitInterface,
}: {
  children: ReactNode;
  store: AppStore;
  unitInterface: UnitInterface;
}) => {
  const value = useMemo(
    () => ({ store, unitInterface }),
    [store, unitInterface],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  return useContext(AppContext);
}

export function useStoreAccess() {
  const { store } = useAppContext();
  const st = store.useSnapshot();
  const mt = store.mutations;
  return [st, mt] as const;
}
