import { UnitInterface } from "wafer-host/unit-types";
import { SequencerEngine } from "./engine/sequencer";
import { AppProvider } from "./model/app-context";
import { AppStore } from "./model/store";
import { PageRoot } from "./view/page-root";
import { useGenerateMappedNotes } from "./hooks/generator-hooks";
import { useFixStates } from "./hooks/state-fix-hooks";

const EffectsHookBox = ({ engine }: { engine: SequencerEngine }) => {
  useGenerateMappedNotes(engine);
  useFixStates();
  return null;
};

export function PianoRollUnitView({
  store,
  unitInterface,
  engine,
}: {
  store: AppStore;
  unitInterface: UnitInterface;
  engine: SequencerEngine;
}) {
  return (
    <AppProvider store={store} unitInterface={unitInterface}>
      <EffectsHookBox engine={engine} />
      <PageRoot />
    </AppProvider>
  );
}
