import { ReactUnitTemplateFn } from "wafer-host/react";
import { useGenerateMappedNotes } from "./logic/generator-hooks";
import { useFixStates } from "./logic/state-fix-hooks";
import { AppProvider } from "./root/app-context";
import { setupUnit } from "./root/drivers";
import { PageRoot } from "./root/page-root";
import { createSequencerEngine, SequencerEngine } from "./root/sequencer";
import { createAppStore } from "./root/store";

const EffectsHookBox = ({ engine }: { engine: SequencerEngine }) => {
  useGenerateMappedNotes(engine);
  useFixStates();
  return null;
};

export const createPianoRollUnit: ReactUnitTemplateFn = (unitInterface) => {
  const store = createAppStore();
  const engine = createSequencerEngine(unitInterface);
  setupUnit(unitInterface, store, engine);
  return {
    RenderUi() {
      return (
        <AppProvider store={store}>
          <EffectsHookBox engine={engine} />
          <PageRoot />
        </AppProvider>
      );
    },
  };
};
