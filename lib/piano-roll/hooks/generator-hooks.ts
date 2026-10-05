import { useLayoutEffect } from "react";
import { useAppContext } from "../model/app-context";
import { SequencerEngine } from "../engine/sequencer";
import { generateMappedNotes } from "../engine/pattern-mapper";

export function useGenerateMappedNotes(engine: SequencerEngine) {
  const { store } = useAppContext();
  const { inputNotes, patternNotes, loopBars, patternEnabled, keySpec } =
    store.useSnapshot();
  useLayoutEffect(() => {
    const mappedNotes = patternEnabled
      ? generateMappedNotes(inputNotes, patternNotes, {
          loopBars,
          keySpec,
        })
      : null;
    store.setMappedNotes(mappedNotes);
    engine.setNotes(mappedNotes ?? inputNotes);
  }, [
    inputNotes,
    patternNotes,
    patternEnabled,
    store.setMappedNotes,
    loopBars,
    keySpec,
    engine.setNotes,
  ]);
}
