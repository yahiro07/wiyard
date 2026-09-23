import { KeyName } from "@lib/contract";
import { appEnvs } from "@/common/app-config";
import { UnitItem } from "@/domain/types";
import { ProjectData, projectsConstants } from "@/project/project-types";

export const defaultBoardSize = { width: 4000, height: 2800 };
export const graphAreaSize = { width: 1400, height: 800 };

const ox = 0;
const oy = 0;

function createDefaultScene(): ProjectData {
  const unitItems: UnitItem[] = [
    {
      type: "noteInput",
      unitId: "noteInputPort1",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: ox + 50, y: oy + 200 },
    },
    {
      type: "speaker",
      unitId: "speakerPort",
      cardPosition: { x: ox + 1000, y: oy + 200 },
    },
    {
      type: "board",
      unitId: "drum1",
      catalogKey: "js808",
      cardPosition: { x: ox + 400, y: oy },
    },
    {
      type: "board",
      unitId: "synth1",
      catalogKey: "webaudioTinysynthMini",
      cardPosition: { x: ox + 400, y: oy + 200 },
    },
    {
      type: "board",
      unitId: "effect1",
      catalogKey: "sunsetDelay",
      cardPosition: { x: ox + 700, y: oy + 200 },
    },
  ];

  const wireConnectionKeys = [
    "noteInputPort1.noteOutput>synth1.noteInput",
    "drum1.audioOutput>speakerPort.audioInput",
    "synth1.audioOutput>effect1.audioInput",
    "effect1.audioOutput>speakerPort.audioInput",
  ];

  if (appEnvs.isDevelopment) {
    unitItems.push({
      type: "noteInput",
      unitId: "noteInputPort2",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: ox + 50, y: oy + 350 },
    });
  }

  return {
    appVersionCode: appEnvs.appVersionCode,
    pageDeployId: appEnvs.cfPagesDeployId,
    formatCode: projectsConstants.formatCode,
    storeStates: {
      unitItems,
      currentNoteChannelId: "noteInputPort1",
      currentAutomationChannelId: null,
      wireConnectionKeys,
      wireGains: {},
      wireAutomationParameterIds: {},
      sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
      keyName: "C" as KeyName,
      windowSpecs: {},
      windowsEvacuated: false,
      currentWindowId: null,
      bpm: 120,
      unitClockingFlags: {},
    },
    unitStates: [],
  };
}

export const defaultScene = createDefaultScene();

function createBlankScene(): ProjectData {
  const unitItems: UnitItem[] = [
    {
      type: "noteInput",
      unitId: "noteInputPort1",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: ox + 50, y: oy + 200 },
    },
    {
      type: "speaker",
      unitId: "speakerPort",
      cardPosition: { x: ox + 1000, y: oy + 200 },
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
    },
    unitStates: [],
  };
}
export const blankScene = createBlankScene();
