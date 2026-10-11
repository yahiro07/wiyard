import { setupMidiKeyboardInput } from "@lib/utils/midi-keyboard-input";
import { useEffect } from "react";
import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { builtinUnitIds } from "@/domain/unit-entries";
import { MessageToUnit } from "@lib/contract";
import { clampValue } from "@lib/utils/number-helper";

function createMidiClockTempoSynchronizer(
  getAppBpm: () => number,
  setAppBpm: (bpm: number) => void,
) {
  const clocksPerQuarter = 24;
  let markedAt: number | undefined;
  let clocksSinceMark = 0;
  return {
    reset() {
      markedAt = undefined;
      clocksSinceMark = 0;
    },
    handleMidiClock() {
      const now = performance.now();
      if (markedAt === undefined) {
        markedAt = now;
        clocksSinceMark = 0;
        return;
      }
      clocksSinceMark += 1;
      if (clocksSinceMark < clocksPerQuarter) return;
      const sourceBpm = clampValue(
        Math.round(60000 / (now - markedAt)),
        60,
        180,
      );
      const hostBpm = Math.round(getAppBpm());
      if (sourceBpm !== hostBpm) {
        setAppBpm(sourceBpm);
      }
      markedAt = now;
      clocksSinceMark = 0;
    },
  };
}

export function useMidiInputHandling() {
  const { midiInEnabled } = store.useSnapshot();
  useEffect(() => {
    if (midiInEnabled) {
      const noteToUnitIdMap: Record<number, string> = {};
      const destUnitId = builtinUnitIds.keyboard;
      const tempoSynchronizer = createMidiClockTempoSynchronizer(
        () => store.state.bpm,
        (bpm) => store.setBpm(bpm),
      );

      return setupMidiKeyboardInput({
        noteOn(noteNumber) {
          if (destUnitId) {
            hostSystem.deliverNote({ destUnitId, noteNumber, isOn: true });
            noteToUnitIdMap[noteNumber] = destUnitId;
          }
        },
        noteOff(noteNumber) {
          if (destUnitId) {
            hostSystem.deliverNote({ destUnitId, noteNumber, isOn: false });
            delete noteToUnitIdMap[noteNumber];
          }
        },
        controlChange(controlNumber, value) {
          hostSystem.sendMessageToUnit(builtinUnitIds.controlSurface, {
            type: "controlChange",
            controlNumber,
            value,
          } satisfies MessageToUnit);
        },
        rawBytes(status) {
          if (store.state.settings.syncToExternalMidiClock) {
            if (status === 0xfa) {
              if (!store.state.playing) {
                store.setPlaying(true);
              }
              tempoSynchronizer.reset();
            } else if (status === 0xfb) {
              if (!store.state.playing) {
                store.setPlaying(true);
              }
              tempoSynchronizer.reset();
            } else if (status === 0xfc) {
              if (store.state.playing) {
                store.setPlaying(false);
              }
              tempoSynchronizer.reset();
            } else if (status === 0xf8) {
              tempoSynchronizer.handleMidiClock();
            }
          }
        },
      });
    }
  }, [midiInEnabled]);
}
