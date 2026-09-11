import { LoopBarLength, Note, PatternBarLength } from "../definitions/types";

export function generateMappedNotes(
  inputNotes: Note[],
  patternNotes: Note[],
  configs: {
    loopBars: LoopBarLength;
    patternBars: PatternBarLength;
  },
): Note[] {
  let idSequence = 1;
  return inputNotes.flatMap((inputNote) => {
    return patternNotes.map((patternNote) => {
      return {
        id: idSequence++,
        position: inputNote.position + patternNote.position,
        pitch: inputNote.pitch + (patternNote.pitch - 7),
        duration: patternNote.duration,
      };
    });
  });
}
