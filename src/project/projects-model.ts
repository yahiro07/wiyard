import { tryParseJson } from "@lib/utils/general-helper";
import { appEnvs } from "@/common/app-config";
import { blankScene, defaultScene } from "@/project/default-data";
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

export type ProjectsModel = {
  exportProject(): void;
  importProject(): void;
  loadBlankProject(): void;
  loadDemoProject(): void;
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
        void projectDataIo.applyProjectData(projectData, res.fileName);
      } catch (error: any) {
        console.warn(error);
        store.setProjectLoadErrorStatus({
          message: `error importing project: ${error}`,
        });
      }
    },
    loadBlankProject() {
      void projectDataIo.applyProjectData(blankScene);
    },
    loadDemoProject() {
      void projectDataIo.applyProjectData(defaultScene);
    },
  };
}

export const projectsModel = createProjectsModel();
