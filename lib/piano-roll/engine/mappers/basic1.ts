import { uiConfig } from "../../definitions/ui-config";
import { NotesMapperFn, buildScalePitches, shiftNotePitch } from "./common";

export function createNotesMapperBasic1(): NotesMapperFn {
  return ({ inputNotes, patternNotes, keySpec }) => {
    const scalePitches = buildScalePitches(keySpec);

    let seqNoteIndex = 0;
    return inputNotes.flatMap((inputNote) => {
      return patternNotes.map((patternNote) => {
        const pitch = shiftNotePitch(
          inputNote.pitch,
          patternNote.pitch - uiConfig.patternPitchCenter,
          scalePitches,
        );
        return {
          id: 0xffff + seqNoteIndex++,
          position: inputNote.position + patternNote.position,
          pitch,
          duration: patternNote.duration,
          parentNoteId: inputNote.id,
        };
      });
    });
  };
}
