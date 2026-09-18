import { hostSystem } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { MessageFromUnit } from "@lib/contract";
import { useEffect } from "react";

const moduleActions = {
  setOutputPortsOptInFlags(unitId: string, flags: Record<string, boolean>) {
    const unitStuff = store.state.unitStuffs[unitId];
    if (unitStuff) {
      store.patchUnitStuffs({
        [unitId]: {
          ...unitStuff,
          outputPortsOptInFlags: flags,
        },
      });
    } else {
      console.warn("missing unitStuff to patch", unitId);
    }
  },
};

export function useSetupUnitPortMasking() {
  useEffect(() => {
    // console.log("useSetupUnitPortMasking");
    return hostSystem.eventPort.subscribe((ev) => {
      if (ev.type === "messageFromUnit") {
        const message = ev.message as MessageFromUnit;
        if (message.type === "setAutomationOutputPortsOptInFlags") {
          // console.log(
          //   "setAutomationOutputPortsOptInFlags",
          //   message.flags,
          //   ev.senderUnitId,
          // );
          queueMicrotask(() => {
            moduleActions.setOutputPortsOptInFlags(
              ev.senderUnitId,
              message.flags,
            );
          });
        }
      }
    });
  }, []);
}
