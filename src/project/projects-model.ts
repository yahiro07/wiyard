import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { HsUnitStateData } from "wafer-host/core";
import { appConfig } from "@/common/app-config";
import { hostSystem } from "@/domain/host-system-instance";
import { blankScene, defaultScene } from "@/project/default-data";
import {
  ProjectData,
  ProjectDataCore,
  ProjectStoreStates,
} from "@/project/project-types";
import {
  downloadFile,
  loadLocalFileText,
} from "@/project/projects-model-helper";
import { projectResetterStates, store } from "@/store/store";

const projectsConstants = {
  formatCode: "WBP1",
};

export type ProjectsModel = {
  exportProject(): void;
  importProject(): void;
  loadBlankProject(): void;
  loadDemoProject(): void;
};

const helpers = {
  filterProjectStoreStateFields(storeStates: ProjectStoreStates) {
    return pickObjectMembers(
      storeStates,
      {
        unitItems: 1,
        windowSpecs: 1,
        wireConnectionKeys: 1,
        currentNoteChannelId: 1,
        currentWindowId: 1,
        windowsEvacuated: 1,
        bpm: 1,
        sight: 1,
        keyName: 1,
      },
      { skipUndefined: true },
    );
  },
};

const projectDataIo = {
  emitProjectData(): ProjectData {
    const unitStates = hostSystem.getAllUnitStates();
    return {
      appVersionCode: appConfig.appVersionCode,
      pageDeployId: appConfig.cfPageDeployId,
      formatCode: projectsConstants.formatCode,
      storeStates: pickObjectMembers(store.state, {
        unitItems: 1,
        windowSpecs: 1,
        wireConnectionKeys: 1,
        currentWindowId: 1,
        currentNoteChannelId: 1,
        windowsEvacuated: 1,
        bpm: 1,
        sight: 1,
        keyName: 1,
      }),
      unitStates,
    };
  },
  async applyProjectStoreStates(
    storeStates: ProjectStoreStates,
    unitStates?: HsUnitStateData[],
  ) {
    store.setProjectLoading(true);
    try {
      store.assign({
        ...projectResetterStates,
        ...helpers.filterProjectStoreStateFields(storeStates),
        projectLoadedIndex: store.state.projectLoadedIndex + 1,
      });
      await hostSystem.waitUnitsLoaded();
      if (unitStates) {
        hostSystem.setAllUnitStates(unitStates);
      }
    } finally {
      store.setProjectLoading(false);
    }
  },
  async applyProjectData(data: ProjectDataCore) {
    const { storeStates, unitStates } = data;
    await projectDataIo.applyProjectStoreStates(storeStates, unitStates);
  },
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
        if (data.formatCode === projectsConstants.formatCode) {
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
