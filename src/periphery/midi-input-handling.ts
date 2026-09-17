import { setupMidiKeyboardInput } from "@lib/utils/midi-keyboard-input";
import { useEffect } from "react";
import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { kKeyboardUnitId } from "@/domain/unit-entries";

export function useMidiInputHandling() {
  const { midiInEnabled } = store.useSnapshot();
  useEffect(() => {
    if (midiInEnabled) {
      const noteToUnitIdMap: Record<number, string> = {};
      const destUnitId = kKeyboardUnitId;
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
      });
    }
  }, [midiInEnabled]);
}
