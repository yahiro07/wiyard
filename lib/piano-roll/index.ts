import { ReactUnitTemplateFn } from "wafer-host/react";
import { setupUnit } from "./model/drivers";
import { createSequencerEngine } from "./engine/sequencer";
import { createAppStore } from "./model/store";
import { createElement } from "react";
import { PianoRollUnitView } from "./piano-roll-unit-view";

export const createPianoRollUnit: ReactUnitTemplateFn = (unitInterface) => {
  const store = createAppStore();
  const engine = createSequencerEngine(unitInterface);
  setupUnit(unitInterface, store, engine);
  return {
    RenderUi() {
      return createElement(PianoRollUnitView, {
        store,
        unitInterface,
        engine,
      });
    },
  };
};
