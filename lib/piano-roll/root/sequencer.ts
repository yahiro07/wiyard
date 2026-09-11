import { UnitInterface } from "wafer-host/unit-types";
import { LoopBarLength, Note, SequencerEditState } from "../definitions/types";
import { clampValue, linearInterpolate } from "../utils/helpers";

export type SequencerEngine = {
  setNotes(notes: Note[]): void;
  setOctave(octave: number): void;
  setDuty(duty: number): void;
  setLoopBars(loopBars: LoopBarLength): void;
  start(): void;
  processStep(stepIndex: number, time: number, unitDuration: number): void;
  stop(): void;
  previewNoteOn(pitch: number): void;
  previewNoteOff(): void;
};

function getNoteShifted(pitch: number, octave: number) {
  return clampValue(24 + octave * 12 + pitch, 0, 127);
}

export function createSequencerEngine(
  unitInterface: UnitInterface | undefined,
): SequencerEngine {
  const editState: SequencerEditState = {
    notes: [],
    octave: 0,
    duty: 1,
    loopBars: 1,
  };
  const noteOutputPort = unitInterface?.createNoteOutputPort();
  const sentNoteNumbers: Set<number> = new Set();
  let previewNoteNumber: number | null = null;

  const core = {
    processStep(stepIndex: number, time: number, unitDuration: number) {
      const totalSteps = editState.loopBars * 16;
      const pos = stepIndex % totalSteps;
      for (const note of editState.notes) {
        if (note.position === pos) {
          const dutyRate = linearInterpolate(editState.duty, 0, 1, 0.2, 1);
          const noteNumber = getNoteShifted(note.pitch, editState.octave);
          noteOutputPort?.noteOn(noteNumber, time);
          noteOutputPort?.noteOff(
            noteNumber,
            time + note.duration * unitDuration * dutyRate,
          );
          sentNoteNumbers.add(noteNumber);
        }
      }
    },
    clearSentNotes() {
      for (const noteNumber of sentNoteNumbers) {
        noteOutputPort?.noteOff(noteNumber);
      }
      sentNoteNumbers.clear();
    },
  };

  return {
    setNotes(notes: Note[]) {
      editState.notes = notes;
    },
    setOctave(octave: number) {
      editState.octave = octave;
    },
    setDuty(duty: number) {
      editState.duty = duty;
    },
    setLoopBars(loopBars: LoopBarLength) {
      editState.loopBars = loopBars;
    },
    start() {},
    processStep(stepIndex: number, time: number, unitDuration: number) {
      core.processStep(stepIndex, time, unitDuration);
    },
    stop() {
      core.clearSentNotes();
    },
    previewNoteOn(pitch: number) {
      if (previewNoteNumber !== null) {
        noteOutputPort?.noteOff(previewNoteNumber);
        previewNoteNumber = null;
      }
      const noteNumber = getNoteShifted(pitch, editState.octave);
      noteOutputPort?.noteOn(noteNumber);
      previewNoteNumber = noteNumber;
    },
    previewNoteOff() {
      if (previewNoteNumber !== null) {
        noteOutputPort?.noteOff(previewNoteNumber);
        previewNoteNumber = null;
      }
    },
  };
}
