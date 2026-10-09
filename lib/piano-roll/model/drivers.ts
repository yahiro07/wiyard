import { UnitInterface } from "wafer-host/unit-types";
import { SequencerEngine } from "../engine/sequencer";
import { AppStore } from "./store";
import { createLiveNoteInput } from "../engine/live-note-input";
import { createPersistence } from "./persistence";
import { inBetween } from "@lib/utils/number-helper";

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
        {
          const playBarPosition = playPos / 16;
          const sight = store.state.sight;
          const isInView = inBetween(
            playBarPosition,
            sight.xBarPosition,
            sight.xBarPosition + sight.wBars,
          );
          if (!isInView) {
            const pos = Math.floor(playBarPosition / sight.wBars) * sight.wBars;
            store.patchSight({ xBarPosition: pos });
          }
        }
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
