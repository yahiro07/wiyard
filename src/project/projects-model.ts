import { tryParseJson } from "@lib/utils/general-helper";
import { projectDataIo } from "@/project/project-data-io";
import { migrateProjectData } from "@/project/project-data-migrator";
import { raiseProjectLoadingError } from "@/project/project-error";
import { ProjectData } from "@/project/project-types";
import {
  downloadFile,
  loadLocalFileText,
  saveProjectJsonToLocalFileSystem,
} from "@/project/projects-model-helper";
import { store } from "@/store/store";
import { projectDataTextSupport } from "@/project/shared-url-support";
import { windowIds } from "@/domain/types";
import { appEnvs } from "@/common/app-envs";

export type ProjectsModel = {
  exportProject(): Promise<void>;
  importProject(): Promise<void>;
  loadProject(projectData: ProjectData): void;
  loadProjectDataText(projectDataText: string): void;
  debugDumpProjectData(): void;
};

function createProjectsModel(): ProjectsModel {
  return {
    async exportProject() {
      const projectData = projectDataIo.emitProjectData();
      const text = JSON.stringify(projectData, null, 2);
      const isSaveFilePickerAvailable = "showSaveFilePicker" in window;
      const fileName = store.state.importedProjectFileName ?? "project.json";

      if (isSaveFilePickerAvailable) {
        try {
          const savedFileName = await saveProjectJsonToLocalFileSystem(
            text,
            fileName,
          );
          if (savedFileName) {
            store.setImportedProjectFileName(savedFileName);
          }
        } catch (error) {
          console.warn(error);
        }
      } else {
        const uri = `data:application/json;charset=utf-8,${encodeURIComponent(text)}`;
        downloadFile(uri, fileName);
      }
    },
    async importProject() {
      try {
        const res = await loadLocalFileText();
        if (!res) return;
        const inputProjectData = tryParseJson<ProjectData>(res.content, () =>
          raiseProjectLoadingError(`failed to parse project data json`),
        );
        const projectData = migrateProjectData(inputProjectData);
        if (projectData.pageDeployId !== appEnvs.cfPagesDeployId) {
          //todo: show selection dialog
          //the data saved in an old version of the app
          //--open in a new tab with the compatible version of the app (safe, recommended)
          //--load the data in this tab (data might be corrupted)
        }
        void projectDataIo.applyProjectData(projectData, {
          importedProjectFileName: res.fileName,
          applyWorkspaceSettings: true,
        });
      } catch (error: any) {
        console.warn(error);
        store.setProjectLoadErrorStatus({
          message: `error importing project: ${error}`,
        });
      }
    },
    loadProject(projectData: ProjectData) {
      void projectDataIo.applyProjectData(projectData);
    },
    loadProjectDataText(projectDataText: string) {
      const projectData = projectDataTextSupport.parseProjectDataText(
        projectDataText,
        false,
      );
      void projectDataIo.applyProjectData(projectData);
    },
    debugDumpProjectData() {
      const projectData = projectDataIo.emitProjectData();
      if (0) {
        //dump for default project
        const pd = structuredClone(projectData);
        pd.storeStates.windowSpecs = {
          [windowIds.keyboard]: pd.storeStates.windowSpecs[windowIds.keyboard],
        };
        pd.unitStates = [];
        console.log(JSON.stringify(pd, null, 2));
      }
      if (1) {
        const projectDataText =
          projectDataTextSupport.emitProjectDataText(projectData);
        console.log(projectDataText);
      }
    },
  };
}

export const projectsModel = createProjectsModel();
