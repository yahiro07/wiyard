import { seqNumbers, clampValue } from "@lib/utils/number-helper";
import { SongKeySpec } from "wafer-host/unit-types";
import { Note, LoopBarLength } from "../../definitions/types";

type NotesMapperArguments = {
  inputNotes: Note[];
  patternNotes: Note[];
  loopBars: LoopBarLength;
  keySpec: SongKeySpec;
};
export type NotesMapperFn = (args: NotesMapperArguments) => Note[];

export function buildScalePitches(keySpec: SongKeySpec) {
  const subIndices = [0, 2, 4, 5, 7, 9, 11];
  const tr = keySpec.relativeKeyTranspose;
  return seqNumbers(6).flatMap((i) => subIndices.map((si) => i * 12 + si + tr));
}

export function shiftNotePitch(
  pitch: number,
  degrees: number,
  scalePitches: number[],
) {
  if (degrees === 0) return pitch;

  let index = scalePitches.indexOf(pitch);
  if (index === -1) {
    index = scalePitches.indexOf(pitch - 1);
  }
  const index2 = clampValue(index + degrees, 0, scalePitches.length - 1);
  return scalePitches[index2];
}

export function ceilPatternSteps(step: number) {
  if (step <= 4) return 4;
  if (step <= 8) return 8;
  if (step <= 16) return 16;
  if (step <= 32) return 32;
  if (step <= 64) return 64;
  if (step <= 128) return 128;
  return 256; //max 16bars
}

export function getCeiledStepsForNotes(notes: Note[]): number {
  if (notes.length === 0) return 0;
  return ceilPatternSteps(
    Math.max(...notes.map((it) => it.position + it.duration)),
  )!;
}

export function applyMappedNoteIds(notes: Note[]): Note[] {
  return notes.map((note, index) => {
    return {
      ...note,
      id: 0xffff + index,
    };
  });
}

export function makePatternNotesRepeated(
  headNotes: Note[],
  patternSteps: number,
  stepsTo: number,
): Note[] {
  const resNotes: Note[] = [];
  const nx = Math.ceil(stepsTo / patternSteps);
  for (let i = 0; i < nx; i++) {
    const offset = i * patternSteps;
    for (const note of headNotes) {
      resNotes.push({
        ...note,
        id: 0,
        position: offset + note.position,
      });
    }
  }
  return resNotes;
}
