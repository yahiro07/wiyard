import { useLayoutEffect } from "react";
import { useAppContext } from "../root/app-context";
import { SequencerEngine } from "../root/sequencer";
import { generateMappedNotes } from "./pattern-mapper";

export function useGenerateMappedNotes(engine: SequencerEngine) {
  const { store } = useAppContext();
  const {
    inputNotes,
    patternNotes,
    loopBars,
    patternBars,
    patternEnabled,
    keySpec,
  } = store.useSnapshot();
  useLayoutEffect(() => {
    const mappedNotes = patternEnabled
      ? generateMappedNotes(inputNotes, patternNotes, {
          loopBars,
          patternBars,
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
    patternBars,
    keySpec,
    engine.setNotes,
  ]);
}
