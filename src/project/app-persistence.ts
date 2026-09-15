import { pickObjectMembers, typedAssign } from "@lib/utils/array-object-helper";
import { dequal } from "dequal";
import { appEnvs } from "@/common/app-config";
import { projectDataIo } from "@/project/project-data-io";
import { ProjectData } from "@/project/project-types";
import { sharedUrlSupport } from "@/project/shared-url-support";
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
  async load() {
    try {
      const text = localStorage.getItem("wireboard-states");
      let userSelfProject: ProjectData | undefined;
      if (text) {
        const data = JSON.parse(text) as PersistenceData;
        store.assign(data.sessionStates);
        userSelfProject = data.projectData;
      }
      const sharedUrlProjectResult =
        sharedUrlSupport.loadSharedUrlDataIfExists();
      if (sharedUrlProjectResult) {
        const res = sharedUrlProjectResult;
        store.setUserSelfProjectActive(false);
        if (res.status === "ok") {
          await projectDataIo.applyProjectData(res.projectData);
        } else {
          console.warn(res.message);
          alert(res.message);
        }
      } else {
        store.setUserSelfProjectActive(true);
        if (userSelfProject) {
          await projectDataIo.applyProjectData(userSelfProject);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
if (appEnvs.isDevelopment && 1) {
  //bypass persistence for debug
  typedAssign(appPersistence, {
    async load() {},
    save() {},
  });
}

export function setupAutoPersistenceTask() {
  if (!store.state.userSelfProjectActive) return;

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
