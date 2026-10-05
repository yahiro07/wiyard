import { SongKeySpec } from "wafer-host/unit-types";
import { LoopBarLength, Note, PatternMode } from "../definitions/types";
import { notesMapperBasic1 } from "./mappers/basic1";
import { notesMapperShift2 } from "./mappers/shift2";

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
  const mapperFn =
    { "1": notesMapperBasic1, "2": notesMapperShift2 }["2"] ??
    notesMapperBasic1;
  return mapperFn({ inputNotes, patternNotes, loopBars, keySpec });
}
