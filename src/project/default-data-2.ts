import { defaultAppWorkspaceSettings } from "@/common/app-settings";
import { defaultBoardSize, defaultGraphSpec } from "@/project/default-data";
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
            x: -400,
            y: 0,
          },
        },
        {
          type: "speaker",
          unitId: "speakerPort",
          cardPosition: {
            x: 400,
            y: 0,
          },
        },
        {
          type: "board",
          unitId: "sirius_1",
          catalogKey: "sirius",
          cardPosition: {
            x: 0,
            y: 0,
          },
        },
        {
          type: "board",
          unitId: "graphiteDrumMachine_1",
          catalogKey: "graphiteDrumMachine",
          cardPosition: {
            x: 0,
            y: -200,
          },
        },
      ],
      unitControlEffects: {
        sirius_1: {
          volume: 0.5,
          pan: 0.5,
        },
        graphiteDrumMachine_1: {
          volume: 0.5,
          pan: 0.5,
        },
      },
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
            x: 0,
            y: 250,
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
      bpm: 130,
      sight: {
        eyeScaling: 1,
        eyeOffset: { x: 0, y: 0 },
      },
      keyName: "C",
      unitClockingFlags: {},
      boardSize: defaultBoardSize,
      graphSpec: defaultGraphSpec,
    },
    unitStates: [],
    workspaceSettings: defaultAppWorkspaceSettings,
  },
} satisfies Record<string, ProjectData>;

export const defaultData2S = {
  demo1:
    "pVbbcuI4EP0XPzPB95hUzVbJ4CRMlgRCbTKbra0pYWTwYiyvLHNJKv--LfmCAcOwNbwkbh316ZZOt_pDwUnyQlga0rhLp0S5UVa6rXY0W2kpCZ6RHkkiuu1PYQFjPJlMNN2ApYCyJebFjld3qIEt5ZSRMcecpMrNh5LFIe9zsoSPvz4Uvk0ENKac9OMk44CXAOG4Mg4p49IT-TcjsU9YN8Jp-kC2AEpCHNNnGkWw7mM2HdI05BC1oNooN1-MjtpSAKirn5-tii9NCF4QVmcrTIKr2ZVpNXnyacwZjcYZC7BP6g6PVhp8albhVDOsPbcTCuC6N078eUxdgvkA-_MwJj_EifiY44jO8qM4gpzgzBm_aM55xkmqGsckwnrWr66ed4sjjkP2fXnsulz5ifvPz79zd938gL0gID6X2mo6JDCvaJQtIRj1yhLqBY_w32erHsoZVHEOJxEAWYeMQDQxxAEBQzZC3Af6vRKfTxmH7992xNJaKj9nusLZNKQFsqbK3F5iG1K9bGON-wI8HLVI7g6HsTjhIleUcQp1DrkOMcNLwgnrT6v1eErX44T48kqq-nztC7s0HZSoZujyai3DlAcuCofEfBy-w1l_gMMpnys3tm22lDkJZ3MOtagJYApNJQMWOGkp9oAR8izCUm44ywjcUQh3AqITX-K-q7C9aQhd6VWG2hCSrQEXRGRq9sl4OioIsoxHB1n-_3gWZCvL42QcppPHoRv6yThMpxaHZpkNcRzQ7jemXzoEw4JKqA5B035OfqJEDxNXnSLxzhlJmLZdY7c6R-x71XsoO8PSRB2LVqifVZ65l6RlNNHst5IDKsOCOCWPfpbHhjqoeOzrJp5dOZ26trxNCjk2s2hqXbg2dOsazTKMwyXgRcc-r17hP2MM_D9CB-vOMaxFzc92gds1jRo6zqKoQuQ5SSeHeZZ9JfVW2M9glgBQgKMUwpokS_F-QlJpntOHQrZk7OMojGeiRXdUQ3WsjnFtQeqqqrXE-lMQpESC8xZ0ZWgdywLYtaFaplkIA65LNa8dA2YfVdM1wxZ5Q9k-QtODKLvFw9aNqL8AttsIz4o2KAv78IL3jl535NnPGE7mol0KYHFle8EdX2iZGmSSRDgmhzcMPDsawSKiFnGWUxgMXiemrB8pzZhPxuWkJV6a4iHfiq2QGE6JbYKBvH9brNYj5I4QQrPBHCHvFm09-H_W7Y9Qr7vug230hEIPBZvnN0DBD9bF7379FeRcC-NoWipo_0lB2a38jxB7-d6MIyrefMgklNvnQmkkxpOoJo0VjrL8vRZcBVC_FCjmnIuA5qVA61KgGLMvAl5fCnTOA-U7PyW_4y2FV78EwJQdzuL0NtxUu-RsV91a-YKdkckb-npw1c2j7Kn9Qi0uemTBeuYiIbVcRu69tn0LNmjkVVav65kvHuBGhciErefNgWbjvsDvj8LmdSNzA3vRA6i3sN3ev616sPdbjePO1Z8Hb4BzgaSw3fdfnwcv21LKwu7178adwXcQ--53297PuRqmT6Y56rEn54mPYwf13MGf7bYzkCTr93Zv6Ax6CMF3rz3voz6aCerDY90brE_SrN0FMhw3WLttNHTyYIftNrrvtCGbiSKVQNkiTaAMx4Rz6DRykBNz34scgB9iOgFToRGoyHISdzGrzLKteRFZyY6_e0L22voYJHfHwqR8U_4D",
};
