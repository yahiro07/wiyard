import { UnitInterface } from "wafer-host/unit-types";
import { createAutomationEngine } from "./engine";
import { AppStore } from "./store";

export function setupDrivers(store: AppStore, unitInterface: UnitInterface) {
  const engine = createAutomationEngine(unitInterface);

  const unsubscribeStore = store.subscribe(({ points, loopBars }) => {
    if (points) {
      engine.setPoints(points);
    }
    if (loopBars) {
      engine.setLoopBars(loopBars);
    }
  }, true);

  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    clockHandlers: engine.clockHandlers,
    persistence: {
      emitState() {
        return store.state;
      },
      applyState(state) {
        store.assign(state);
      },
    },
    cleanup() {
      unsubscribeStore();
    },
  });
}
