import { SongKeySpec } from "wafer-host/unit-types";
import { LoopBarLength, Note, PatternMode } from "../definitions/types";
import { createNotesMapperBasic1 } from "./mappers/basic1";

const notesMappers = {
  basic1: createNotesMapperBasic1(),
};

export function generateMappedNotes(
  inputNotes: Note[],
  patternNotes: Note[],
  configs: {
    loopBars: LoopBarLength;
    keySpec: SongKeySpec;
    patternMode: PatternMode;
  },
): Note[] {
  const { loopBars, keySpec, patternMode } = configs;
  if (patternMode === "1") {
    return notesMappers.basic1({
      inputNotes,
      patternNotes,
      loopBars,
      keySpec,
    });
  } else if (patternMode === "2") {
    return [];
  }
  return [];
}
