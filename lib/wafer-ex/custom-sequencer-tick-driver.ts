import {
  ConnectionRule,
  createSequencerTickDriverCore,
  HostSystem,
  HsUnitInstance,
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

  const activeUnitsMap = new Map<string, HsUnitInstance>();

  return {
    setBpm: core.setBpm,
    start() {
      if (!running) {
        tickFrameIndex = 0;
        oxLogger.clockingStart();

        const initialUnits = getTargetUnits();
        processUnitsStartStop(initialUnits, "start");
        activeUnitsMap.clear();
        for (const unit of initialUnits) {
          activeUnitsMap.set(unit.unitId, unit);
        }

        core.start({
          processScheduling(timeFrom, barFrom, barTo, bpm) {
            oxLogger.clockingFrameStart(tickFrameIndex);
            const newUnits = getTargetUnits();
            const newUnitIds = new Set(newUnits.map((unit) => unit.unitId));
            for (const [_, unit] of activeUnitsMap) {
              if (!newUnitIds.has(unit.unitId)) {
                processUnitsStartStop([unit], "stop");
                hostSystem.notesDispatcher.flushAllNotesOff({
                  noteSourceUnitId: unit.unitId,
                });
                activeUnitsMap.delete(unit.unitId);
              }
            }
            for (const unit of newUnits) {
              if (!activeUnitsMap.has(unit.unitId)) {
                processUnitsStartStop([unit], "start");
                activeUnitsMap.set(unit.unitId, unit);
              }
            }
            processUnitsScheduling(newUnits, timeFrom, barFrom, barTo, bpm);
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
        hostSystem.notesDispatcher.flushAllNotesOff();
        const activeUnits = Array.from(activeUnitsMap.values());
        processUnitsStartStop(activeUnits, "stop");
        activeUnitsMap.clear();
        oxLogger.clockingStop();
        running = false;
      }
    },
    setSceneClockingSpec(spec) {
      sceneClockingSpec = spec;
    },
  };
}
