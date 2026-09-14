import { KeyName } from "@lib/contract";
import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { WindowSpec } from "@lib/window-system";
import { HsUnitStateData } from "wafer-host/core";
import { FieldSight } from "@/components/field-sight-plane";
import { hostSystem } from "@/domain/host-system-instance";
import { UnitItem, WindowId } from "@/domain/types";
import { blankScene, defaultScene } from "@/project/default-data";
import {
  downloadFile,
  loadLocalFileText,
} from "@/project/projects-model-helper";
import { projectResetterStates, StoreState, store } from "@/store/store";

export type ProjectsModel = {
  exportProject(): void;
  importProject(): void;
  loadBlankProject(): void;
  loadDemoProject(): void;
};

type ProjectData = {
  formatCode: string;
  unitItems: UnitItem[];
  windowSpecs: Record<WindowId, WindowSpec>;
  wireConnectionKeys: string[];
  currentNoteChannelId: string;
  currentWindowId: string | null;
  windowsEvacuated: boolean;
  bpm: number;
  unitStates: HsUnitStateData[];
  sight: FieldSight;
  keyName: KeyName;
};

const helpers = {
  filterLoadedProjectDataFields(data: ProjectData) {
    return pickObjectMembers(
      data,
      {
        formatCode: 1,
        unitItems: 1,
        windowSpecs: 1,
        wireConnectionKeys: 1,
        currentNoteChannelId: 1,
        currentWindowId: 1,
        windowsEvacuated: 1,
        bpm: 1,
        unitStates: 1,
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
      formatCode: "WBP1",
      ...pickObjectMembers(store.state, {
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
    storeAttrs: Partial<StoreState>,
    unitStates?: HsUnitStateData[],
  ) {
    store.setProjectLoading(true);
    try {
      store.assign({
        ...projectResetterStates,
        ...storeAttrs,
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
  async applyProjectData(data: ProjectData) {
    const { formatCode, unitStates, ...storeAttrs } = data;
    await projectDataIo.applyProjectStoreStates(storeAttrs, unitStates);
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
        if (data.formatCode === "WBP1") {
          const data1 = helpers.filterLoadedProjectDataFields(data);
          await projectDataIo.applyProjectData(data1);
        } else {
          alert(`incompatible project format: ${data.formatCode}`);
        }
      } catch (error) {
        console.warn("error importing project", error);
      }
    },
    loadBlankProject() {
      projectDataIo.applyProjectStoreStates(blankScene);
    },
    loadDemoProject() {
      projectDataIo.applyProjectStoreStates(defaultScene);
    },
  };
}

export const projectsModel = createProjectsModel();
