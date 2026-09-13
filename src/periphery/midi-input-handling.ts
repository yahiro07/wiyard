import { useEffect } from "react";
import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { setupMidiKeyboardInput } from "@/utils/midi-keyboard-input";

export function useMidiInputHandling() {
  const { midiInEnabled } = store.useSnapshot();
  useEffect(() => {
    if (midiInEnabled) {
      const noteToUnitIdMap: Record<number, string> = {};
      return setupMidiKeyboardInput({
        noteOn(noteNumber) {
          const destUnitId = store.state.currentNoteChannelId;
          if (destUnitId) {
            hostSystem.deliverNote({ destUnitId, noteNumber, isOn: true });
            noteToUnitIdMap[noteNumber] = destUnitId;
          }
        },
        noteOff(noteNumber) {
          const destUnitId = noteToUnitIdMap[noteNumber];
          if (destUnitId) {
            hostSystem.deliverNote({ destUnitId, noteNumber, isOn: false });
            delete noteToUnitIdMap[noteNumber];
          }
        },
      });
    }
  }, [midiInEnabled]);
}
