import { UnitInterface } from "wafer-host/unit-types";
import { createPersistence } from "./persistence";
import { createSequencerEngine } from "./sequencer";
import { AppStore } from "./store";

export function setupUnit(unitInterface: UnitInterface, store: AppStore) {
  const engine = createSequencerEngine(unitInterface);

  const unsubscribeStore = store.subscribe(
    ({ inputNotes, previewNotePitch, octave, duty, loopBars }) => {
      if (inputNotes !== undefined) {
        engine.setNotes(inputNotes);
      }
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
      if (octave !== undefined) {
        engine.setOctave(octave);
      }
      if (duty !== undefined) {
        engine.setDuty(duty);
      }
    },
    true,
  );

  unitInterface?.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      // viewSize: [800, 450],
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
        const playPosTotalSteps = Math.max(store.state.loopBars * 16, 32);
        const playPos = stepPos % playPosTotalSteps;
        store.setPlayPos(playPos);
        const expectedPage = Math.floor(playPos / 32);
        if (store.state.pageIndex !== expectedPage) {
          store.setPageIndex(expectedPage);
        }
      },
      processStep(stepIndex, time, unitDuration) {
        engine.processStep(stepIndex, time, unitDuration);
      },
    },
    persistence: createPersistence(store),
    cleanup: unsubscribeStore,
  });
}
