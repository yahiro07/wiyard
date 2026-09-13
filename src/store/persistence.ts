import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { WindowSpec } from "@lib/window-system";
import { dequal } from "dequal";
import { HsUnitStateData } from "wafer-host/core";
import { FieldSight } from "@/components/field-sight-plane";
import { appConfig } from "@/domain/app-config";
import { hostSystem } from "@/domain/host-system-instance";
import { UnitItem, WindowId } from "@/domain/types";
import { store } from "@/store/store";

type PersistenceData = {
  unitItems: UnitItem[];
  windowSpecs: Record<WindowId, WindowSpec>;
  wireConnectionKeys: string[];
  currentWindowId: string | null;
  currentNoteChannelId: string;
  windowsEvacuated: boolean;
  midiInEnabled: boolean;
  bpm: number;
  masterVolume: number;
  unitStates: HsUnitStateData[];
  sight: FieldSight;
};

export const persistence = {
  emitPersistenceData(): PersistenceData {
    const unitStates = hostSystem.getAllUnitStates();
    return {
      ...pickObjectMembers(store.state, {
        unitItems: 1,
        windowSpecs: 1,
        wireConnectionKeys: 1,
        currentWindowId: 1,
        currentNoteChannelId: 1,
        windowsEvacuated: 1,
        midiInEnabled: 1,
        bpm: 1,
        masterVolume: 1,
        sight: 1,
      }),
      unitStates,
    };
  },
  save(data: PersistenceData) {
    localStorage.setItem("wireboard-states", JSON.stringify(data));
    console.log("saved");
    // console.log(JSON.stringify(data, null, 2));
  },
  load() {
    const text = localStorage.getItem("wireboard-states");
    if (!text) return;
    try {
      void (async () => {
        const { unitStates, ...storeAttrs } = JSON.parse(
          text,
        ) as PersistenceData;
        store.assign(storeAttrs);
        await hostSystem.waitUnitsLoaded();
        hostSystem.setAllUnitStates(unitStates);
      })();
    } catch (error) {
      console.error(error);
    }
  },
};
if (appConfig.isDevelopment && 0) {
  //bypass persistence for debug
  Object.assign(persistence, {
    load() {},
    save() {},
  });
}

export function setupAutoPersistenceTask() {
  let latestData = persistence.emitPersistenceData();
  const internal = {
    ensureLatestSaved() {
      if (store.state.projectLoading) return;
      const data = persistence.emitPersistenceData();
      if (!dequal(data, latestData)) {
        persistence.save(data);
        latestData = data;
      }
    },
  };
  const timerId = setInterval(() => {
    internal.ensureLatestSaved();
  }, 5 * 1000);
  return () => clearInterval(timerId);
}
