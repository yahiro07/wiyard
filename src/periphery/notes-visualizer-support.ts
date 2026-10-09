import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { useEffect } from "react";
import { WaferExNotesVisualizer } from "@lib/wafer-ex";
import { UnitItem } from "@/domain/types";

const helpers = {
  broadcastNote(
    targetUnits: UnitItem[],
    ch: number,
    noteNumber: number,
    isOn: boolean,
  ): void {
    for (const unit of targetUnits) {
      hostSystem.sendMessageToUnit(unit.unitId, {
        type: "note",
        ch,
        isOn,
        noteNumber,
      } satisfies WaferExNotesVisualizer["MessageFromHost"]);
    }
  },
};

export function useSetupNotesVisualizerSupport() {
  useEffect(() => {
    hostSystem.setUnitNoteOutputMonitor((e) => {
      const targetUnits = store.state.unitItems.filter(
        (it) => it.type === "board" && it.catalogKey === "nv1",
      );
      if (targetUnits.length > 0) {
        if (e.sourceUnitId.endsWith("_sourceSequencer")) {
          const index = parseInt(
            e.sourceUnitId.split("_")[0]?.replace("noteInputPort", ""),
            10,
          );
          if (isFinite(index) && index >= 1) {
            const ch = index - 1;
            helpers.broadcastNote(targetUnits, ch, e.noteNumber, e.isOn);
          }
        }
      }
    });
    return () => {
      hostSystem.setUnitNoteOutputMonitor(undefined);
    };
  }, []);
}
