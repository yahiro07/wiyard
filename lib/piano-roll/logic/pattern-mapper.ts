import { LoopBarLength, Note, PatternBarLength } from "../definitions/types";
import { clampValue, seqNumbers } from "../utils/helpers";

type NotesMapperFn = (args: {
  inputNotes: Note[];
  patternNotes: Note[];
  loopBars: LoopBarLength;
  patternBars: PatternBarLength;
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
  ({ inputNotes, patternNotes, loopBars, patternBars }) => {
    const scalePitches = buildScalePitches();

    let idSequence = 1;
    return inputNotes.flatMap((inputNote) => {
      return patternNotes.map((patternNote) => {
        const pitch = shiftNotePitch(
          inputNote.pitch,
          patternNote.pitch - 7,
          scalePitches,
        );
        return {
          id: idSequence++,
          position: inputNote.position + patternNote.position,
          pitch,
          duration: patternNote.duration,
        };
      });
    });
  },
);

const notesMapperSerialFill = createNotesMapperFn(
  ({ inputNotes, patternNotes, loopBars, patternBars }) => {
    if (inputNotes.length === 0) return [];
    const firstNote = inputNotes[0];
    let pitchPoints = [
      { pos: 0, pitch: firstNote.pitch },
      ...inputNotes.map((note) => ({
        pos: note.position,
        pitch: note.pitch,
      })),
    ];
    pitchPoints = pitchPoints.filter(
      (pp, index) => pitchPoints.findIndex((it) => it.pos === pp.pos) === index,
    );
    return [];
  },
);

const notesMappers = {
  basic1: notesMapperBasic1,
  serialFill: notesMapperSerialFill,
};

export function generateMappedNotes(
  inputNotes: Note[],
  patternNotes: Note[],
  configs: {
    loopBars: LoopBarLength;
    patternBars: PatternBarLength;
  },
): Note[] {
  const { loopBars, patternBars } = configs;
  return notesMappers.basic1({
    inputNotes,
    patternNotes,
    loopBars,
    patternBars,
  });
}
