import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { appEnvs } from "@/common/app-config";
import { hostSystem } from "@/domain/host-system-instance";
import { migrateProjectData } from "@/project/project-data-migrator";
import {
  ProjectData,
  ProjectStoreStates,
  projectsConstants,
} from "@/project/project-types";
import { projectResetterStates, store } from "@/store/store";

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
      appVersionCode: appEnvs.appVersionCode,
      pageDeployId: appEnvs.cfPagesDeployId,
      formatCode: projectsConstants.formatCode,
      storeStates: helpers.filterStoreStateFields(store.state),
      unitStates,
    };
  },
  checkCompatibility(data: ProjectData) {
    return data.formatCode === projectsConstants.formatCode;
  },
  async applyProjectData(
    inputProjectData: ProjectData,
    importedProjectFileName?: string,
  ) {
    const projectData = migrateProjectData(inputProjectData);
    const { storeStates, unitStates } = projectData;
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
