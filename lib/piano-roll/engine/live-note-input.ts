import { NoteInputPort } from "wafer-host/unit-types";
import { SequencerEngine } from "./sequencer";
import { AppStore } from "../model/store";

export function createLiveNoteInput(
  engine: SequencerEngine,
  store: AppStore,
): NoteInputPort {
  const notesMap: Record<number, number> = {};

  return {
    noteOn(noteNumber, time, attrs) {
      const ni = noteNumber + store.state.octaveShift * 12;
      engine.noteOutputPort?.noteOn(ni, time, attrs);
      notesMap[noteNumber] = ni;
    },
    noteOff(noteNumber, time) {
      const ni = notesMap[noteNumber];
      if (ni !== undefined) {
        engine.noteOutputPort?.noteOff(ni, time);
        delete notesMap[noteNumber];
      }
    },
  };
}
