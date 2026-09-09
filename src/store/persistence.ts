import { HsUnitStateData } from "wafer-host/core";
import { Size } from "@/domain/common-types";
import { hostSystem } from "@/domain/host-system-instance";
import { UnitItem, WindowStatus } from "@/domain/types";
import { store } from "@/store/store";
import { pickObjectMembers } from "@/utils/helpers";

type PersistenceData = {
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  sequencerWindowPosition: Point;
  sequencerWindowSize: Size;
  currentWindowUnitId: string | null;
  sequencerWindowStatus: WindowStatus;
  currentNoteChannelId: string;
  windowsEvacuated: boolean;
  midiInEnabled: boolean;
  bpm: number;
  masterVolume: number;
  unitStates: HsUnitStateData[];
};

export const persistence = {
  save() {
    const unitStates = hostSystem.getAllUnitStates();
    const data: PersistenceData = {
      ...pickObjectMembers(store.state, {
        unitItems: 1,
        wireConnectionKeys: 1,
        sequencerWindowPosition: 1,
        sequencerWindowSize: 1,
        currentWindowUnitId: 1,
        sequencerWindowStatus: 1,
        currentNoteChannelId: 1,
        windowsEvacuated: 1,
        midiInEnabled: 1,
        bpm: 1,
        masterVolume: 1,
      }),
      unitStates,
    };
    localStorage.setItem("wireboard-states", JSON.stringify(data));
    console.log("saved");
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
