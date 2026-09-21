import { UnitInterface } from "wafer-host/unit-types";
import { createPersistence } from "./persistence";
import { SequencerEngine } from "./sequencer";
import { AppStore } from "./store";
import { createLiveNoteInput } from "./leve-note-input";

export function setupUnit(
  unitInterface: UnitInterface,
  store: AppStore,
  engine: SequencerEngine,
) {
  const unsubscribeStore = store.subscribe(
    ({ previewNotePitch, octaveShift, noteDuty, loopBars }) => {
      if (loopBars !== undefined) {
        engine.setLoopBars(loopBars);
      }
      if (previewNotePitch !== undefined) {
        if (previewNotePitch !== null) {
          engine.previewNoteOn(previewNotePitch);
        } else {
          engine.previewNoteOff();
        }
      }
      if (octaveShift !== undefined) {
        engine.setOctaveShift(octaveShift);
      }
      if (noteDuty !== undefined) {
        engine.setNoteDuty(noteDuty);
      }
    },
    true,
  );

  const liveNoteInput = createLiveNoteInput(engine, store);

  unitInterface?.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      // viewSize: [800, 450],
    },
    noteInput: {
      noteOn(noteNumber, time, attrs) {
        store.setLiveInputNoteNumbers([
          ...store.state.liveInputNoteNumbers,
          noteNumber,
        ]);
        liveNoteInput.noteOn(noteNumber, time, attrs);
      },
      noteOff(noteNumber, time) {
        store.setLiveInputNoteNumbers(
          store.state.liveInputNoteNumbers.filter((n) => n !== noteNumber),
        );
        liveNoteInput.noteOff(noteNumber, time);
      },
    },
    clockHandlers: {
      start() {
        engine.start();
      },
      stop() {
        engine.stop();
        store.setPlayPos(null);
      },
      processScheduling(_timeFrom, barFrom, _barTo, _bpm) {
        const stepPos = barFrom * 16;
        const playPosTotalSteps = store.state.loopBars * 16;
        const playPos = stepPos % playPosTotalSteps;
        store.setPlayPos(playPos);
        // const expectedPage = Math.floor(playPos / 32);
        // if (store.state.pageIndex !== expectedPage) {
        //   store.setPageIndex(expectedPage);
        // }
      },
      processStep(stepIndex, time, unitDuration) {
        engine.processStep(stepIndex, time, unitDuration);
      },
    },
    hostCallbacks: {
      setKey(keySpec) {
        store.setKeySpec(keySpec);
      },
    },
    unitCallbacks: {
      setViewActive(viewActive) {
        store.setViewActive(viewActive);
      },
    },
    persistence: createPersistence(store),
    cleanup: unsubscribeStore,
  });
}
