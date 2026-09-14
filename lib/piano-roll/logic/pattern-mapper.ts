import { clampValue, seqNumbers } from "@lib/utils/number-helper";
import { SongKeySpec } from "wafer-host/unit-types";
import { LoopBarLength, Note, PatternBarLength } from "../definitions/types";

type NotesMapperFn = (args: {
  inputNotes: Note[];
  patternNotes: Note[];
  loopBars: LoopBarLength;
  patternBars: PatternBarLength;
  keySpec: SongKeySpec;
}) => Note[];

function createNotesMapperFn(fn: NotesMapperFn): NotesMapperFn {
  return fn;
}

function buildScalePitches() {
  const subIndices = [0, 2, 4, 5, 7, 9, 11];
  return seqNumbers(6).flatMap((i) => subIndices.map((si) => i * 12 + si));
}

function shiftNotePitch(
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

const notesMapperBasic1 = createNotesMapperFn(
  ({ inputNotes, patternNotes }) => {
    const scalePitches = buildScalePitches();

    let seqNoteIndex = 0;
    return inputNotes.flatMap((inputNote) => {
      return patternNotes.map((patternNote) => {
        const pitch = shiftNotePitch(
          inputNote.pitch,
          patternNote.pitch - 7,
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
  },
);

const notesMappers = {
  basic1: notesMapperBasic1,
};

export function generateMappedNotes(
  inputNotes: Note[],
  patternNotes: Note[],
  configs: {
    loopBars: LoopBarLength;
    patternBars: PatternBarLength;
    keySpec: SongKeySpec;
  },
): Note[] {
  const { loopBars, patternBars, keySpec } = configs;
  return notesMappers.basic1({
    inputNotes,
    patternNotes,
    loopBars,
    patternBars,
    keySpec,
  });
}
