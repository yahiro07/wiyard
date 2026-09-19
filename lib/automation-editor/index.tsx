import { ReactUnitTemplateFn } from "wafer-host/react";
import { LoopBars } from "./types";
import { CurveEditorRoot } from "./curve-editor";
import { createSelectorOptions } from "@lib/utils/selector-option";
import { ShiftSelector } from "./shift-selector";
import { AppStore, createAppStore, useStoreAccessor } from "./store";
import { createAutomationEngine } from "./engine";
import { UnitInterface } from "wafer-host/unit-types";

const loopBarsOptions = createSelectorOptions<LoopBars>([
  [0.25, "1/4"],
  [0.5, "1/2"],
  [1, "1"],
  [2, "2"],
  [4, "4"],
  [8, "8"],
  [16, "16"],
  [32, "32"],
  [64, "64"],
]);
const LoopBarsSelector = ({ store }: { store: AppStore }) => {
  const { loopBars } = store.useSnapshot();
  return (
    <ShiftSelector
      options={loopBarsOptions}
      value={loopBars}
      onChange={store.setLoopBars}
    />
  );
};

const App = ({ store }: { store: AppStore }) => {
  const accessor = useStoreAccessor(store);
  return (
    <div className="bg-#ccc p-3 flex-vc gap-2 w-full h-full text-#333">
      <div className="w-full flex-ha justify-between">
        <h3>Automation Editor</h3>
        <div className="flex-ha gap-3">
          <div>loop bars</div>
          <LoopBarsSelector store={store} />
        </div>
      </div>
      <CurveEditorRoot accessor={accessor} />
    </div>
  );
};

function setupDrivers(store: AppStore, unitInterface: UnitInterface) {
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
    cleanup() {
      unsubscribeStore();
    },
  });
}

export const createAutomationEditorUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const store = createAppStore();
  setupDrivers(store, unitInterface);
  return {
    RenderUi() {
      return <App store={store} />;
    },
  };
};
