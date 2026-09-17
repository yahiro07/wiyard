import { UnitInterface } from "wafer-host/unit-types";
import { createPersistence } from "./persistence";
import { SequencerEngine } from "./sequencer";
import { AppStore } from "./store";

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

  unitInterface?.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      // viewSize: [800, 450],
    },
    noteInput: {
      noteOn(noteNumber, time, attrs) {
        engine.noteOutputPort?.noteOn(noteNumber, time, attrs);
      },
      noteOff(noteNumber, time) {
        engine.noteOutputPort?.noteOff(noteNumber, time);
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
    persistence: createPersistence(store),
    cleanup: unsubscribeStore,
  });
}
