import { UnitInterface } from "wafer-host/unit-types";
import { persistence } from "./persistence";
import { createSequencerEngine } from "./sequencer";
import { store } from "./store";

export function setupUnit(unitInterface: UnitInterface) {
  const st = store.state;
  const engine = createSequencerEngine(unitInterface);

  unitInterface?.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      viewSize: [800, 450],
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
        const playPosTotalSteps = Math.max(st.loopBars * 16, 32);
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
    persistence: persistence,
  });

  return {
    setupSynchronization: () =>
      store.subscribe(({ notes, previewNotePitch, octave, duty, loopBars }) => {
        if (notes !== undefined) {
          engine.setNotes(notes);
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
      }, true),
  };
}
