import { useLayoutEffect } from "react";
import { useAppContext } from "../root/app-context";
import { generateMappedNotes } from "./pattern-mapper";

export function useGenerateMappedNotes() {
  const { store } = useAppContext();
  const { inputNotes, patternNotes, loopBars, patternBars, patternEnabled } =
    store.useSnapshot();
  useLayoutEffect(() => {
    //usually mapped notes are generated when user edits notes or options
    const mappedNotes = patternEnabled
      ? generateMappedNotes(inputNotes, patternNotes, { loopBars, patternBars })
      : inputNotes;
    store.setMappedNotes(mappedNotes);
  }, [
    inputNotes,
    patternNotes,
    patternEnabled,
    store.setMappedNotes,
    loopBars,
    patternBars,
  ]);
}
