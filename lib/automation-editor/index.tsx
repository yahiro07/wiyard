import { ReactUnitTemplateFn } from "wafer-host/react";
import { useMemo } from "react";
import { createStore } from "snap-store";
import { KnotPoint } from "./types";
import { CurveEditorRoot } from "./curve-editor";

const defaultPoints: KnotPoint[] = [
  { x: 0, y: 0, curved: false },
  { x: 1, y: 1, curved: false },
];
const store = createStore<{ points: KnotPoint[] }>({ points: defaultPoints });

const App = () => {
  const accessor = useMemo(() => {
    return {
      getPoints: () => store.state.points,
      usePoints: () => store.useSnapshot().points,
      setPoints: store.setPoints,
    };
  }, []);
  return (
    <div className="bg-#ccc p-3 flex-vc gap-2 w-full h-full">
      <h3>Automation Editor</h3>
      <CurveEditorRoot accessor={accessor} />
      {/* <div className="bd-#666 w-400px h-300px">
        <MultiPointsEditor accessor={accessor} />
      </div> */}
    </div>
  );
};

export const createAutomationEditorUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const automationOutputPort = unitInterface.createAutomationOutputPort();
  const timerId = setInterval(() => {
    automationOutputPort.emitValue(Math.random());
  }, 1000);
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    cleanup() {
      clearInterval(timerId);
    },
  });
  return {
    RenderUi() {
      return <App />;
    },
  };
};
