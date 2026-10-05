import { Note } from "../../definitions/types";
import { uiConfig } from "../../definitions/ui-config";
import {
  NotesMapperFn,
  applyMappedNoteIds,
  buildScalePitches,
  ceilPatternSteps,
  makePatternNotesRepeated,
  shiftNotePitch,
} from "./common";
import { isDefined } from "@lib/utils/general-helper";

function generateNotesShifted(
  inputNote: Note,
  patternNotes: Note[],
  patternSteps: number,
  scalePitches: number[],
): Note[] {
  const pitchCenter = uiConfig.patternPitchCenter;
  const inputLeft = inputNote.position;
  const inputRight = inputNote.position + inputNote.duration;

  const patternOffset = inputNote.position % patternSteps;
  const patternHeadStridingNotes = patternNotes.filter(
    (it) =>
      it.position < patternOffset && it.position + it.duration > patternOffset,
  );
  const patternRotatedNotes = [
    ...patternHeadStridingNotes.map((it) => {
      let pos = inputLeft + it.position - patternOffset;
      return { ...it, position: pos };
    }),
    ...patternNotes.map((it) => {
      let pos = inputLeft + it.position - patternOffset;
      if (pos < inputLeft) {
        pos += patternSteps;
      }
      return { ...it, position: pos };
    }),
  ];
  const patternOverlappingNotes = patternRotatedNotes.filter(
    (it) => inputLeft < it.position + it.duration && it.position < inputRight,
  );
  const patternClippedNotes = patternOverlappingNotes.map((it) => {
    if (it.position < inputLeft) {
      const cutout = inputLeft - it.position;
      return {
        ...it,
        position: it.position + cutout,
        duration: it.duration - cutout,
      };
    } else if (it.position + it.duration > inputRight) {
      const cutout = it.position + it.duration - inputRight;
      return {
        ...it,
        duration: it.duration - cutout,
      };
    }
    return it;
  });
  return patternClippedNotes
    .map((it) => {
      const pos = it.position;
      const duration = it.duration;
      const pitch = shiftNotePitch(
        inputNote.pitch,
        it.pitch - pitchCenter,
        scalePitches,
      );
      return {
        id: 0,
        position: pos,
        duration,
        pitch,
        parentNoteId: inputNote.id,
      };
    })
    .filter(isDefined());
}

export const notesMapperShift2: NotesMapperFn = ({
  inputNotes,
  patternNotes,
  keySpec,
}) => {
  if (patternNotes.length === 0) {
    return [];
  }
  const scalePitches = buildScalePitches(keySpec);
  const patternSteps = ceilPatternSteps(
    Math.max(...patternNotes.map((note) => note.position + note.duration)),
  )!;
  const repeatedPatternNotes = makePatternNotesRepeated(
    patternNotes,
    patternSteps,
    32,
  );
  return applyMappedNoteIds(
    inputNotes.flatMap((inputNote) =>
      generateNotesShifted(inputNote, repeatedPatternNotes, 32, scalePitches),
    ),
  );
};
