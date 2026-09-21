import { ProjectData } from "@/project/project-types";

export const defaultData2 = {
  starter: {
    appVersionCode: "v260916",
    pageDeployId: "aaabbb123",
    formatCode: "WBP1",
    storeStates: {
      unitItems: [
        {
          type: "noteInput",
          unitId: "noteInputPort1",
          sequencerClassKey: "pianoRoll",
          cardPosition: {
            x: 1750,
            y: 1250,
          },
        },
        {
          type: "speaker",
          unitId: "speakerPort",
          cardPosition: {
            x: 2380,
            y: 1250,
          },
        },
        {
          type: "controlSurface",
          unitId: "controlSurface",
          cardPosition: {
            x: 1550,
            y: 1350,
          },
        },
        {
          type: "board",
          unitId: "sirius_1",
          catalogKey: "sirius",
          cardPosition: {
            x: 2050,
            y: 1250,
          },
        },
        {
          type: "board",
          unitId: "graphiteDrumMachine_1",
          catalogKey: "graphiteDrumMachine",
          cardPosition: {
            x: 2050,
            y: 1080,
          },
        },
      ],
      wireConnectionKeys: [
        "noteInputPort1.noteOutput>sirius_1.noteInput",
        "sirius_1.audioOutput>speakerPort.audioInput",
        "graphiteDrumMachine_1.audioOutput>speakerPort.audioInput",
      ],
      wireGains: {},
      wireAutomationParameterIds: {},
      windowSpecs: {
        keyboardWindow: {
          position: {
            x: 629,
            y: 600,
          },
          contentSize: {
            width: 480,
            height: 154,
          },
          status: "visible",
          pinned: true,
        },
      },
      currentNoteChannelId: "noteInputPort1",
      currentAutomationChannelId: null,
      currentWindowId: "keyboardWindow",
      windowsEvacuated: false,
      bpm: 120,
      sight: {
        eyeScaling: 1,
        eyeOffset: {
          x: -40.37109375,
          y: 119.31640625,
        },
      },
      keyName: "C",
      unitClockingFlags: {},
    },
    unitStates: [],
  },
} satisfies Record<string, ProjectData>;
