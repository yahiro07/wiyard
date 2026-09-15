import { pickObjectMembers, typedAssign } from "@lib/utils/array-object-helper";
import { dequal } from "dequal";
import { appConfig } from "@/common/app-config";
import { projectDataIo } from "@/project/project-data-io";
import { ProjectData } from "@/project/project-types";
import { store } from "@/store/store";

type AppSessionStates = {
  midiInEnabled: boolean;
  masterVolume: number;
  uiScaling: number;
};

type PersistenceData = {
  projectData: ProjectData;
  sessionStates: AppSessionStates;
};

export const appPersistence = {
  emitPersistenceData(): PersistenceData {
    const projectData = projectDataIo.emitProjectData();
    const sessionStates = pickObjectMembers(store.state, {
      midiInEnabled: 1,
      masterVolume: 1,
      uiScaling: 1,
    });
    return { projectData, sessionStates };
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
        const { projectData, sessionStates } = JSON.parse(
          text,
        ) as PersistenceData;
        store.assign(sessionStates);
        await projectDataIo.applyProjectData(projectData);
      })();
    } catch (error) {
      console.error(error);
    }
  },
};
if (appConfig.isDevelopment && 1) {
  //bypass persistence for debug
  typedAssign(appPersistence, {
    load() {},
    save() {},
  });
}

export function setupAutoPersistenceTask() {
  let latestData = appPersistence.emitPersistenceData();
  const internal = {
    ensureLatestSaved() {
      if (store.state.projectLoading) return;
      const data = appPersistence.emitPersistenceData();
      if (!dequal(data, latestData)) {
        appPersistence.save(data);
        latestData = data;
      }
    },
  };
  const timerId = setInterval(() => {
    internal.ensureLatestSaved();
  }, 5 * 1000);
  return () => clearInterval(timerId);
}
