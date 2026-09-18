import { pickObjectMembers, typedAssign } from "@lib/utils/array-object-helper";
import { tryParseJson, tryParseJsonOrNull } from "@lib/utils/general-helper";
import { appEnvs } from "@/common/app-config";
import { projectDataIo } from "@/project/project-data-io";
import { migrateProjectData } from "@/project/project-data-migrator";
import { raiseProjectLoadingError } from "@/project/project-error";
import { ProjectData } from "@/project/project-types";
import { sharedUrlSupport } from "@/project/shared-url-support";
import { store } from "@/store/store";
import { hostSystem } from "@/domain/host-system-instance";
import { builtinUnitIds } from "@/domain/unit-entries";

type AppSessionStates = {
  midiInEnabled: boolean;
  masterVolume: number;
  uiScaling: number;
};

type PersistenceData = {
  projectData: ProjectData;
  sessionStates: AppSessionStates;
  controlSurfaceState: Record<string, any> | null;
};

const helpers = {
  pickSessionStates(storeState: AppSessionStates) {
    return pickObjectMembers(storeState, {
      midiInEnabled: 1,
      masterVolume: 1,
      uiScaling: 1,
    });
  },
};

export const appPersistence = {
  emitPersistenceData(): PersistenceData {
    const projectData = projectDataIo.emitProjectData();
    const sessionStates = helpers.pickSessionStates(store.state);
    const controlSurfaceState =
      hostSystem.sendMessageToUnit(builtinUnitIds.controlSurface, {
        type: "emitSessionState",
      }) ?? null;
    return { projectData, sessionStates, controlSurfaceState };
  },
  save(data: PersistenceData) {
    try {
      localStorage.setItem("wireboard-states", JSON.stringify(data));
      console.log("saved");
      // console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn(error);
    }
  },
  load() {
    const url = new URLSearchParams(location.search);
    const urlDataText = url.get("data");

    if (urlDataText) {
      try {
        const storageText = localStorage.getItem("wireboard-states");
        let controlSurfaceState: Record<string, any> | null = null;
        if (storageText) {
          const data = tryParseJsonOrNull<PersistenceData>(storageText);
          if (data) {
            store.assign(helpers.pickSessionStates(data.sessionStates));
            controlSurfaceState = data.controlSurfaceState;
          }
        }
        const inputProjectData =
          sharedUrlSupport.loadSharedUrlData(urlDataText);
        if (inputProjectData.pageDeployId !== appEnvs.cfPagesDeployId) {
          //todo: consider adding version selection phase
          //if the data is saved in an old version, it's preferred to open in that version
          //since the migration logic could not be perfect
        }
        const projectData = migrateProjectData(inputProjectData);
        void (async () => {
          //this floating promise is out of the scope of try-catch block
          //error occurred in each unit is notified to the mount point component
          await projectDataIo.applyProjectData(projectData);
          if (controlSurfaceState) {
            hostSystem.sendMessageToUnit(builtinUnitIds.controlSurface, {
              type: "applySessionState",
              state: controlSurfaceState,
            });
          }
        })();
      } catch (error: any) {
        //fatal
        console.warn(error);
        store.setProjectLoadErrorStatus({
          message: `error loading shared url data: ${error}`,
          reloadPageWithCleanUrl: true,
        });
      }
      store.setLoadedFromSharedUrl(true);
    } else {
      try {
        const text = localStorage.getItem("wireboard-states");
        if (text) {
          const data = tryParseJson<PersistenceData>(text, () =>
            raiseProjectLoadingError(`failed to parse persistence data json`),
          );
          store.assign(helpers.pickSessionStates(data.sessionStates));
          const inputProjectData = data.projectData;
          if (inputProjectData.pageDeployId !== appEnvs.cfPagesDeployId) {
            //todo: consider adding version selection phase
            //if the data is saved in an old version, it's preferred to open in that version
            //since the migration logic could not be perfect
          }
          const projectData = migrateProjectData(data.projectData);
          void projectDataIo.applyProjectData(projectData);
          store.setAutoPersistenceEnabled(true);
        } else {
          store.setAutoPersistenceEnabled(true);
        }
      } catch (error: any) {
        //if the error caused by migration, it should be treated as fatal
        //show explicit ui to revoke the data manually or open the data in the created version
        console.warn(error);
        store.setProjectLoadErrorStatus({
          message: `error loading persistence data: ${error}`,
        });
        //at this point, discard the old data and force refresh new states
        appPersistence.save(appPersistence.emitPersistenceData());
        store.setAutoPersistenceEnabled(true);
      }
    }
  },
};
if (appEnvs.isDevelopment && 0) {
  //bypass persistence load for debug
  typedAssign(appPersistence, {
    async load() {
      store.setAutoPersistenceEnabled(true);
    },
    // save() {},
  });
}
