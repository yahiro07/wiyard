import { ReactUnitTemplateFn } from "wafer-host/react";
import { useGenerateMappedNotes } from "./logic/generator-hooks";
import { AppProvider } from "./root/app-context";
import { setupUnit } from "./root/drivers";
import { PageRoot } from "./root/page-root";
import { createAppStore } from "./root/store";

const EffectsHookBox = () => {
  useGenerateMappedNotes();
  return null;
};

export const createPianoRollUnit: ReactUnitTemplateFn = (unitInterface) => {
  const store = createAppStore();
  setupUnit(unitInterface, store);
  return {
    RenderUi() {
      return (
        <AppProvider store={store}>
          <EffectsHookBox />
          <PageRoot />
        </AppProvider>
      );
    },
  };
};
