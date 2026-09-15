import { blankScene, defaultScene } from "@/project/default-data";
import { projectDataIo } from "@/project/project-data-io";
import { ProjectData } from "@/project/project-types";
import {
  downloadFile,
  loadLocalFileText,
} from "@/project/projects-model-helper";

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
      const fileName = "project.json";
      downloadFile(uri, fileName);
    },
    async importProject() {
      try {
        const text = await loadLocalFileText();
        if (!text) return;
        const data = JSON.parse(text) as ProjectData;
        if (projectDataIo.checkCompatibility(data)) {
          await projectDataIo.applyProjectData(data);
        } else {
          alert(`incompatible project format: ${data.formatCode}`);
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
