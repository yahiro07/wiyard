import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { appConfig } from "@/common/app-config";
import { hostSystem } from "@/domain/host-system-instance";
import {
  ProjectData,
  ProjectDataCore,
  ProjectStoreStates,
} from "@/project/project-types";
import { projectResetterStates, store } from "@/store/store";

const projectsConstants = {
  formatCode: "WBP1",
};

const helpers = {
  filterStoreStateFields(storeStates: ProjectStoreStates) {
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

export const projectDataIo = {
  emitProjectData(): ProjectData {
    const unitStates = hostSystem.getAllUnitStates();
    return {
      appVersionCode: appConfig.appVersionCode,
      pageDeployId: appConfig.cfPageDeployId,
      formatCode: projectsConstants.formatCode,
      storeStates: helpers.filterStoreStateFields(store.state),
      unitStates,
    };
  },
  checkCompatibility(data: ProjectData) {
    return data.formatCode === projectsConstants.formatCode;
  },
  async applyProjectData(
    data: ProjectDataCore,
    importedProjectFileName?: string,
  ) {
    const { storeStates, unitStates } = data;
    store.setProjectLoading(true);
    try {
      store.assign({
        ...projectResetterStates,
        ...helpers.filterStoreStateFields(storeStates),
        projectLoadedIndex: store.state.projectLoadedIndex + 1,
        importedProjectFileName: importedProjectFileName ?? null,
      });
      await hostSystem.waitUnitsLoaded();
      if (unitStates) {
        hostSystem.setAllUnitStates(unitStates);
      }
    } finally {
      store.setProjectLoading(false);
    }
  },
};
