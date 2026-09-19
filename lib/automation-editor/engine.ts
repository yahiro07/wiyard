import { ClockHandlers, UnitInterface } from "wafer-host/unit-types";
import { KnotPoint, LoopBars } from "./types";
import { curveMapperQuadraticPointSampleA_getCurveValueAt } from "./curve-mapper-quadratic-point-sample-a";

type AutomationEngine = {
  setPoints(points: KnotPoint[]): void;
  setLoopBars(loopBars: LoopBars): void;
  clockHandlers: ClockHandlers;
};

function getCurveValue(points: KnotPoint[], pos: number): number {
  return curveMapperQuadraticPointSampleA_getCurveValueAt(points, pos);
}

export function createAutomationEngine(
  unitInterface: UnitInterface,
): AutomationEngine {
  const automationOutputPort = unitInterface.createAutomationOutputPort();
  const editState: { points: KnotPoint[]; loopBars: LoopBars } = {
    points: [],
    loopBars: 4,
  };

  const clockHandlers: ClockHandlers = {
    start() {},
    processStep(stepIndex, time, unitDuration) {
      const totalSteps = 16 * editState.loopBars;
      const pos = stepIndex % totalSteps;
      const nextPos = ((pos + 1) % totalSteps) / totalSteps;
      const nextValue = getCurveValue(editState.points, nextPos);
      automationOutputPort.emitValue(nextValue, {
        time,
        duration: unitDuration,
      });
    },
    stop() {},
  };
  return {
    setPoints(points: KnotPoint[]) {
      editState.points = points;
    },
    setLoopBars(loopBars: LoopBars) {
      editState.loopBars = loopBars;
    },
    clockHandlers,
  };
}
