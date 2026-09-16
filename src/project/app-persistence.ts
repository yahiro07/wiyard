import { pickObjectMembers, typedAssign } from "@lib/utils/array-object-helper";
import { tryParseJson, tryParseJsonOrNull } from "@lib/utils/general-helper";
import { appEnvs } from "@/common/app-config";
import { projectDataIo } from "@/project/project-data-io";
import { migrateProjectData } from "@/project/project-data-migrator";
import { raiseProjectLoadingError } from "@/project/project-error";
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
    const url = new URLSearchParams(location.search);
    const urlDataText = url.get("data");

    if (urlDataText) {
      try {
        const storageText = localStorage.getItem("wireboard-states");
        if (storageText) {
          const data = tryParseJsonOrNull<PersistenceData>(storageText);
          if (data) {
            store.assign(data.sessionStates);
          }
        }
        const projectData = migrateProjectData(
          sharedUrlSupport.loadSharedUrlData(urlDataText),
        );
        void projectDataIo.applyProjectData(projectData);
      } catch (error) {
        //fatal
        console.warn(error);
        store.setProjectLoadErrorStatus({
          message: `error loading shared url data: ${error}`,
          reloadPageWithCleanUrl: true,
        });
      }
    } else {
      try {
        const text = localStorage.getItem("wireboard-states");
        if (text) {
          const data = tryParseJson<PersistenceData>(text, () =>
            raiseProjectLoadingError(`failed to parse persistence data json`),
          );
          store.assign({ ...data.sessionStates, userSelfProjectActive: true });
          const projectData = migrateProjectData(data.projectData);
          void projectDataIo.applyProjectData(projectData);
        } else {
          store.setUserSelfProjectActive(true);
        }
      } catch (error) {
        console.warn(error);
        store.setProjectLoadErrorStatus({
          message: `error loading persistence data: ${error}`,
        });
      }
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
