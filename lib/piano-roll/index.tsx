import { ReactUnitTemplateFn } from "wafer-host/react";
import { useGenerateMappedNotes } from "./hooks/generator-hooks";
import { useFixStates } from "./hooks/state-fix-hooks";
import { AppProvider } from "./model/app-context";
import { setupUnit } from "./model/drivers";
import { PageRoot } from "./view/page-root";
import { createSequencerEngine, SequencerEngine } from "./engine/sequencer";
import { createAppStore } from "./model/store";

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
        <AppProvider store={store} unitInterface={unitInterface}>
          <EffectsHookBox engine={engine} />
          <PageRoot />
        </AppProvider>
      );
    },
  };
};
