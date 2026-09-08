import { useEffect } from "react";
import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { setupMidiKeyboardInput } from "@/utils/midi-keyboard-input";

function getMidiInDestinationUnitId() {
  const noteChannelId = store.state.currentNoteChannelId;
  return store.state.unitItems.find(
    (item) => item.type === "edge" && item.noteChannelId === noteChannelId,
  )?.unitId;
}

export function useMidiInputHandling() {
  const { midiInEnabled } = store.useSnapshot();
  useEffect(() => {
    if (midiInEnabled) {
      const noteToUnitIdMap: Record<number, string> = {};
      return setupMidiKeyboardInput({
        noteOn(noteNumber) {
          const destUnitId = getMidiInDestinationUnitId();
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
