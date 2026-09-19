import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { appEnvs } from "@/common/app-config";
import { hostSystem } from "@/domain/host-system-instance";
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
        wireConnectionKeys: 1,
        wireGains: 1,
        wireAutomationParameterIds: 1,
        windowSpecs: 1,
        currentNoteChannelId: 1,
        currentAutomationChannelId: 1,
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
  async applyProjectData(
    projectData: ProjectData,
    importedProjectFileName?: string,
  ) {
    const { storeStates, unitStates } = projectData;
    store.setProjectLoading(true);
    try {
      store.assign({
        ...projectResetterStates,
        ...helpers.filterStoreStateFields(storeStates),
        projectLoadedIndex: store.state.projectLoadedIndex + 1,
        importedProjectFileName: importedProjectFileName ?? null,
      });
      await hostSystem.waitUnitsLoaded(); //basically this does not throw errors
      if (unitStates) {
        hostSystem.setAllUnitStates(unitStates);
      }
    } finally {
      store.setProjectLoading(false);
    }
  },
};
