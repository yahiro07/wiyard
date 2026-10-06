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
      unitControlEffects: {},
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
  },
} satisfies Record<string, ProjectData>;

export const defaultData2S = {
  demo1:
    "pVZtj9o4EP4v-UyBvNGwUk9yQthNe-zCotttOVWVCQZyhDiXOAsp4r_f2HnZAAnl1EirxePH84ztZ2Z8kHAYvpAo9mhg0QWR7qQ3pdftyz2pJYV4RQYk9GnqLGACYzyfz2VFhakljbaY5StezbEMtpjRiEwZZiSW7g5SEnjMYWQLg78PEktDDg0oI04QJgzwAsAdl8YxjZjwRP5NSOCSyPJxHH8hKYBCDwf0mfo-zLs4Woxp7DGImlPtpbsPar_bkgCodI_HVskXhwRvSFRly02cq96Vptd5cmnAIupPk2iJXVJ1eDFT41PWc6eyqp-4nVMAV70x4q4DahLMRthdewH5wU_ExQz7dJUdxQWkgTNj_CAb1xnncVe9JOHWq36V7nW32GfYi75uL10XM79wfzx-b0k7LyIWDQLicgis53I6U0ybD58SBuM_3lmFtdBatsc2ThYezZEVHWT2AltzA7ctrHDfgM83d4-9gOfLMRuihFHILNjrGEd4SxiJnEU5HyzobhoSVyRYmRGvDrcL01lSyKoiDlNXtbYOHrhUScCm3k-4sgM4XLC1dNfraS1pTbzVmoH6ZQ6MIY0TYIGTFvJaRoQ887CkOxYlBGqDB3cC18xHgMdl2PbCgzrwKkKtCaknAxdEpMm9xnj6XZBAEY8CQvj_8WxIKgTZGIdmZHEoqtIYh2ZU4pB1rSaOM9rTUvBbh6DqeuUQZPnX5HWVo0YTmmpkdSE72Qb2fu_6FYAhrxuXFLqstCF4waHxwJs4qjus56gUkUseJS9wav8KiQEZcJWEL02iCJY-QsGw1hgO1a_vSznuPUcr6CDx_RKR3bxwcp6lRRrH9ht2E2iWAFpiPwYNz8MtbxCwqziL9yCRlExd7HvBCmbaXbXFLU_LZUzEtMhxvS33Za3bU_Iz19rGR51vC5LgEUoIBGHlhdnyqbsBZ0Mfr_KiItLkXPjdkww0RKUXDor2Dh29oX3_iGkSuWRatHBeUPMOkfKlwIhj0tPAQFJ9Q9EEmRNkD1bOGqFvFvJsZKHYcibos4W4jQ65bSn7M4SQCX_8-wTiqIRw0YJzyn9iEEsr-8f1U5TUqU9ZtgtPLF_z2yUBnvuV63jDfgJOurxylkDlViBvnjcBtVuB-q1A_na7CfjxVqBxHSha2YL8iVMKja0AwNPNWwXx0NuXq8SDoby1okhfkcgMfTq76vr3UdN6rhUTPUbL3coEpeWfbT7I6Wy5RxO7tNqWrb3YgJvYBQxUaa-BZm--wPdXbrMtX9vDWvQFlJvbhg-ztwGs_VzhuDeV59EMcCaQ5LYH5_V59JKK37mabed-2h99BaG_f8PO6Z7LF1rjNieD6Ml4YtPAQANz9K3TMUaCZPezMxgbowFCMB501g5y0IpTnx_ryWutkWZnbpBqmMud2UFjIwt23Omgh34HdgNRfz_-Bw",
};
