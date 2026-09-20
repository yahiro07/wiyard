import {
  ConnectionRule,
  createSequencerTickDriverCore,
  HostSystem,
  oxLogger,
  sequencerTickDriverHelper,
} from "wafer-host/core";
import { sortUnitsForClocking } from "./sort-units-for-clocking";

type SceneClockingSpec = {
  flags: Record<string, boolean>; //unitId --> on/off
  fallbackValue: boolean;
};

export type CustomSequencerTickDriver = {
  setBpm(bpm: number): void;
  start(): void;
  stop(): void;
  setSceneClockingSpec(spec: SceneClockingSpec | null): void;
};

export function createCustomSequencerTickDriver(
  hostSystem: HostSystem,
): CustomSequencerTickDriver {
  const { processUnitsStartStop, processUnitsScheduling } =
    sequencerTickDriverHelper;
  const core = createSequencerTickDriverCore(hostSystem.audioContext, 25, 100);
  let tickFrameIndex = 0;
  let sceneClockingSpec: SceneClockingSpec | null;
  let running = false;

  const getTargetUnits = () => {
    const units = hostSystem.getAllUnits().filter((unit) => {
      if (!sceneClockingSpec) return true;
      const flag = sceneClockingSpec.flags[unit.unitId];
      if (flag !== undefined) return flag;
      return sceneClockingSpec.fallbackValue;
    });
    const connectionRules = hostSystem.getConnectionRules() as ConnectionRule[];
    sortUnitsForClocking(units, connectionRules);
    return units;
  };

  return {
    setBpm: core.setBpm,
    start() {
      if (!running) {
        tickFrameIndex = 0;
        oxLogger.clockingStart();
        processUnitsStartStop(getTargetUnits(), "start");
        core.start({
          processScheduling(timeFrom, barFrom, barTo, bpm) {
            oxLogger.clockingFrameStart(tickFrameIndex);
            const units = getTargetUnits();
            processUnitsScheduling(units, timeFrom, barFrom, barTo, bpm);
            oxLogger.clockingFrameEnd(tickFrameIndex);
            tickFrameIndex++;
          },
        });
        running = true;
      }
    },
    stop() {
      if (running) {
        core.stop();
        processUnitsStartStop(getTargetUnits(), "stop");
        oxLogger.clockingStop();
        running = false;
      }
    },
    setSceneClockingSpec(spec) {
      sceneClockingSpec = spec;
    },
  };
}
