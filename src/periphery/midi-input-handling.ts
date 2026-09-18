import { setupMidiKeyboardInput } from "@lib/utils/midi-keyboard-input";
import { useEffect } from "react";
import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { builtinUnitIds } from "@/domain/unit-entries";
import { MessageToUnit } from "@lib/contract";

export function useMidiInputHandling() {
  const { midiInEnabled } = store.useSnapshot();
  useEffect(() => {
    if (midiInEnabled) {
      const noteToUnitIdMap: Record<number, string> = {};
      const destUnitId = builtinUnitIds.keyboard;
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
      });
    }
  }, [midiInEnabled]);
}
