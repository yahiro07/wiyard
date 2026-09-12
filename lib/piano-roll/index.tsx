import { ReactUnitTemplateFn } from "wafer-host/react";
import { AppProvider } from "./root/app-context";
import { setupUnit } from "./root/drivers";
import { PageRoot } from "./root/page-root";
import { createAppStore } from "./root/store";

export const createPianoRollUnit: ReactUnitTemplateFn = (unitInterface) => {
  const store = createAppStore();
  setupUnit(unitInterface, store);
  return {
    RenderUi() {
      return (
        <AppProvider store={store}>
          <PageRoot />
        </AppProvider>
      );
    },
  };
};
