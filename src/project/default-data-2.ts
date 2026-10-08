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
          pan: 0,
        },
        graphiteDrumMachine_1: {
          volume: 0.5,
          pan: 0,
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
          zOrder: 0,
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
    "pVbbcuI4EP0XPzPge0yqZqtkcBImSwKhNpnN1taUMDJ4YyyvLHNJKv--LfmCAcOwNbwkbh316ZZOt_pDwUnyTFga0rhHZ0S5Vla6rXY1W2kpCZ6TPkkiuh3MYAFjPJ1ONd2ApYCyJebFjhd3pIEt5ZSRCcecpMr1h5LFIR9wsoSPvz4Uvk0ENKacDOIk44CXAOG4Mo4o49IT-TcjsU9YL8Jpek-2AEpCHNMnGkWw7mM2G9E05BC1oNoo11-MrtpSAKirn5-tii9NCH4jrM5WmARXsyvTavLk05gzGk0yFmCf1B0erTT41KzCqWZYe26nFMB1b5z4i5i6BPMh9hdhTH6IE_ExxxGd50dxBDnBmTN-0ZzzjNNUNY5JhPWsX1097xZHHIfs-_LYdbnyE_efn3_n7nr5AXtBQHwutdV0SGBe0ShbQjBq2xLqBY9f1LaqfbbqwTTiVMAU53BiHQDrkBGIJYYoIFzIRUj7QL1t8fmYcfj-bUcqraXuc542zmYhLZA1Teb2EtuQ6GUba9wX4OGgRXK3OIzF-Ra5ooxTqHLIdYQZXhJO2GBWrcczup4kxJcXUlXny0DYpemgQDVDlxdrGWbbAg-ibEjMJ-E7nPQHOJzxhXJt22ZLWZBwvuBQiZoAptBSMmCBk5ZSDxghTyIs5ZqzjMANhXAnIDnxJe66CtubhdCTXmSoDSHZGnBBRKZmn4ynq4Icy3h0EOX_j-eNbGVxnIzDdPI4dEM_GYfp1OLQLLMhjgPa_bb0S4dgWFAH1SFooqB-Qn6iQA8TV50i8e4ZSZi2XWO3ukfse7V7KDvD0kQVi0aon1WeuZekZTTR7LeRAyrDgjglj36Wx4Y6qHjsqyaeXTmdura8SQo5NrNoal24NvTqGs0yjMMl4EW_Pq9e4T9jDPw_QAfrLTCsRc2PdoHbNY0aOs6iqELkOUknh3mWfSX1VtjPYJIAUICjFMKaJkvxekJSaZ7Th0K2ZOLjKIznolV3VUN1rK5xZUHqqqq1xPpjEKREgvMW1Da0rmUB7MpQLdMshGG2r4yuZjkw-aiarhm2yBvK9gGaHkTZK561XkT9N2C7ifC8aIOysA8veO_odUee_ZzhZCHapQAWV7YX3PGFlqlBJkmEY3J4w8CzoxEsImoRZzmDwdh1Ysb6kdKM-WRSzlnipSme8a3YConhlNgmGMj7t7fVeozcMUJoPlwg5N2grQf_z3uDMer31gOwjR9R6KFg8_QKKPjBuvjdrb-CnGthHM1KBe0_KSi7lf8RYi_fm0lExYsPmYRy-0IojcR4GtWkscJRlr_WgqsA6pcCxZRzEdC8FGhdChRD9kXAq0uBznmgfOdn5He8pfDqlwCYscN5nN6Em2qXnOyqWytfsDMyeUVfD666eZA9tV-oxUUPLFjPXSSklsvIvdO2r8EGjb3K6vU889kD3LgQmbD1vQXQbNxn-P1R2LxeZG5gL7oH9Ra2m7vXVR_2fqtx3Lr60_AVcC6QFLa7wcvT8HlbSlnYvcHtpDv8DmLf_W46-zlXo_TJNMd99ug88knsoL47_LPTcYaSZP3e6Y-cYR8h-O53FgM0QHNBfXise2P1SZq1-4YMxw3WbgeNnDzYUaeD7rodyGaqSCVQ9pYmUIYTwjl0GjnIibnvWY6_9zGdgqnQCFRkOYe7mFVm2da8iKxkx989IXttfQKSu2VhUr4p_wE",
};
