import { blankScene, defaultScene } from "@/project/default-data";
import { projectDataIo } from "@/project/project-data-io";
import { ProjectData } from "@/project/project-types";
import {
  downloadFile,
  loadLocalFileText,
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
    exportProject() {
      const projectData = projectDataIo.emitProjectData();
      const text = JSON.stringify(projectData, null, 2);
      const uri = `data:application/json;charset=utf-8,${encodeURIComponent(text)}`;
      const fileName = store.state.importedProjectFileName ?? "project.json";
      downloadFile(uri, fileName);
    },
    async importProject() {
      try {
        const res = await loadLocalFileText();
        if (!res) return;
        const projectData = JSON.parse(res.content) as ProjectData;
        if (projectDataIo.checkCompatibility(projectData)) {
          await projectDataIo.applyProjectData(projectData, res.fileName);
        } else {
          alert(`incompatible project format: ${projectData.formatCode}`);
        }
      } catch (error) {
        console.warn("error importing project", error);
      }
    },
    loadBlankProject() {
      projectDataIo.applyProjectData(blankScene);
    },
    loadDemoProject() {
      projectDataIo.applyProjectData(defaultScene);
    },
  };
}

export const projectsModel = createProjectsModel();
