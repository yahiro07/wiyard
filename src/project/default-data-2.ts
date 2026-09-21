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

export const defaultData2S = {
  demo1:
    "pVZtb-I4EP4v-cyVBJJcQNqTnBDa7B4tFF27y2m1MsEhOUKcc5xCFvW_3zhvDSVQdBupKh4_M8_MeDzjg4Tj-ImwJKCRRVdEGkovPV0eKLrUkWK8JiMShzRzVrCBMV4ul0qvD1seZVvMS41nc6qALOGUkTnHnCTS8CClUcAdTraw-Psg8SwW0Ihy4kRxygGfA4ThWjiljOeWyL8piVzCrBAnyReSASgOcEQfaRjCvovZakqTgIPXgmovDRVdkzsSAJW-LL--dmrGJCZ4Q1iTrxQJtnZjvb7RbsylEWc0nKfMwy5p2jzZafNRq33UjswuKYCb1jhx_YiaBPMJdv0gIj9EWlzMcUjXRT5OIGdCkeWSU1Evcy4TuX9KI6QfWVY_iAaHHAfs6_bUerXzEUN-DN870i5gxKJRRFwBAxuiuN7Vz41YPqQc1n-8MefSqvKKUG9wugpoiWzURCGvsC1HcZ1ig_sKfBncLQ4icXteiyVKOYV7BrFOMcNbwglzVvV-tKK7eUzc_LrV9-PZEfJcdJxOVe3l2dT0wY0GBkTJkojPg59wagewt-K-NNR1tSP5JFj7HFQUAUzgTqdAAonOy8xjhDwKr6QhZymBRhHAkcBJixXgce21vQqgKTznnrZ4pCvABR6pin7Wn4GogcqfXk_-H_5sSJbX5C_5oYqWUPmhaGqLH-9oj1vCL5H3Na2RBEX5mLytg5xyD-R-ccG08wXRH-iXDwAEZe9oI4BaK6vuEkUzvHaKRhM5pekrRhmH0D1DYkD5XyQRqiljoHoPzcLyMWQ0bJ9QJe7tfjbQURqGNaI49gtNvbjGif2C3RRGJwA9HCZQxMt4m3c-cLPw-SCRjMxdHAbRGnY6YvngeQnJ9yALvynyja7pvSLhunZjaIpYisDgDtxDAwE3rLI1WyF1N2BqHOJ13lIAJeTVBIehfWZC_0hoylwyr6a06JJl68-EKviOE6KrICCZtqFohswZskdrx0fom4UCG1kosZwZ-mwhIaNjIfOUcIEQMuFPfJ_g1BsunAzYkvKfBKqgU_wThVH1yXlIeRFFkKv7ItkkwsuwkeMXHKZgRBb9sAb2rgWKwXgVUL0WqF0LFM-zq4C_Xws0LgPz-bQif-KMwrSqAPA6C9ZRMg72tVb-EqhPrWq9F0pkgT69O-r2i3JOX9SKie6Zt1ubUGnlZ5t3Srbw9mhm11LbstUnG3Azu4JBVdo-0OzNJ_j-KmW2Fap70EVfoHJL2fhu8TIC3c8Njluz9zhZAM4EklJ25zw_Tp6y_HdZzbZzOx9MvkKhv33j7nHM9evrbJizEXswHvg8MtDInHzrdo1JTrL72R1NjckIIViPur6DHLQW1O_TevQMO0uzMzeob5jezuyiqVE4O-120d2gC9GA199f_wM",
};
