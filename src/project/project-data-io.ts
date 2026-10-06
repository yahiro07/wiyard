import { pickObjectMembers } from "@lib/utils/array-object-helper";
import { hostSystem } from "@/domain/host-system-instance";
import {
  ProjectData,
  ProjectStoreStates,
  projectsConstants,
} from "@/project/project-types";
import { projectResetterStates, store, StoreState } from "@/store/store";
import { appEnvs } from "@/common/app-envs";

const helpers = {
  filterStoreStateFields(storeStates: ProjectStoreStates) {
    return pickObjectMembers(
      storeStates,
      {
        unitItems: 1,
        unitControlEffects: 1,
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
        unitClockingFlags: 1,
        boardSize: 1,
        graphSpec: 1,
      },
      { skipUndefined: true },
    );
  },
  getWorkspaceSettings(storeState: StoreState) {
    const settings = storeState.settings;
    return pickObjectMembers(settings, {
      wireVolumeKnobs: 1,
      partControlBar: 1,
      graphElevation: 1,
      pianoRollWindowSideGrip: 1,
    });
  },
};

export const projectDataIo = {
  emitProjectData(): ProjectData {
    const unitStates = hostSystem.getAllUnitStates();
    const workspaceSettings = helpers.getWorkspaceSettings(store.state);
    return {
      appVersionCode: appEnvs.appVersionCode,
      pageDeployId: appEnvs.cfPagesDeployId,
      formatCode: projectsConstants.formatCode,
      storeStates: helpers.filterStoreStateFields(store.state),
      unitStates,
      workspaceSettings,
    };
  },
  async applyProjectData(
    projectData: ProjectData,
    options?: {
      importedProjectFileName?: string;
      applyWorkspaceSettings?: boolean;
    },
  ) {
    const { storeStates, unitStates, workspaceSettings } = projectData;
    store.setProjectLoading(true);
    try {
      store.assign({
        ...projectResetterStates,
        ...helpers.filterStoreStateFields(storeStates),
        projectLoadedIndex: store.state.projectLoadedIndex + 1,
        importedProjectFileName: options?.importedProjectFileName ?? null,
      });
      if (options?.applyWorkspaceSettings) {
        store.patchSettings(workspaceSettings);
      }
      await hostSystem.waitUnitsLoaded(); //basically this does not throw errors
      if (unitStates) {
        hostSystem.setAllUnitStates(unitStates);
      }
    } finally {
      store.setProjectLoading(false);
    }
  },
};
