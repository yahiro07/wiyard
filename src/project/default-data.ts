import { KeyName } from "@lib/contract";
import { GraphSpec, UnitItem } from "@/domain/types";
import { ProjectData, projectsConstants } from "@/project/project-types";
import { appEnvs } from "@/common/app-envs";

export const defaultBoardSize = { width: 4000, height: 2800 };

export const defaultGraphSpec: GraphSpec = {
  contentOffset: { x: 0, y: 0 },
  contentScaling: 1,
  planeSize: { width: 1400, height: 800 },
};

function createBlankScene(): ProjectData {
  const unitItems: UnitItem[] = [
    {
      type: "noteInput",
      unitId: "noteInputPort1",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: -400, y: 0 },
    },
    {
      type: "speaker",
      unitId: "speakerPort",
      cardPosition: { x: 400, y: 0 },
    },
  ];
  return {
    appVersionCode: appEnvs.appVersionCode,
    pageDeployId: appEnvs.cfPagesDeployId,
    formatCode: projectsConstants.formatCode,
    storeStates: {
      unitItems,
      wireConnectionKeys: [],
      wireGains: {},
      wireAutomationParameterIds: {},
      currentNoteChannelId: "noteInputPort1",
      currentAutomationChannelId: null,
      sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
      keyName: "C" as KeyName,
      windowSpecs: {},
      windowsEvacuated: false,
      currentWindowId: null,
      bpm: 120,
      unitClockingFlags: {},
      boardSize: defaultBoardSize,
      graphSpec: defaultGraphSpec,
    },
    unitStates: [],
  };
}
export const blankScene = createBlankScene();
