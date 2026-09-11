import { createContext, ReactNode, useContext } from "react";
import { AppStore } from "./store";

export const AppContext = createContext<{ store: AppStore }>(null as any);

export const AppProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: AppStore;
}) => {
  return (
    <AppContext.Provider value={{ store }}>{children}</AppContext.Provider>
  );
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
