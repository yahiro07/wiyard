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
  // demo1:
  // "pVZtj9o4EP4v-UyBvNGwUk9yQthNe-zCotttOVWVCQZyhDiXOAsp4r_f2HnZAAnl1EirxePH84ztZ2Z8kHAYvpAo9mhg0QWR7qQ3pdftyz2pJYV4RQYk9GnqLGACYzyfz2VFhakljbaY5StezbEMtpjRiEwZZiSW7g5SEnjMYWQLg78PEktDDg0oI04QJgzwAsAdl8YxjZjwRP5NSOCSyPJxHH8hKYBCDwf0mfo-zLs4Woxp7DGImlPtpbsPar_bkgCodI_HVskXhwRvSFRly02cq96Vptd5cmnAIupPk2iJXVJ1eDFT41PWc6eyqp-4nVMAV70x4q4DahLMRthdewH5wU_ExQz7dJUdxQWkgTNj_CAb1xnncVe9JOHWq36V7nW32GfYi75uL10XM79wfzx-b0k7LyIWDQLicgis53I6U0ybD58SBuM_3lmFtdBatsc2ThYezZEVHWT2AltzA7ctrHDfgM83d4-9gOfLMRuihFHILNjrGEd4SxiJnEU5HyzobhoSVyRYmRGvDrcL01lSyKoiDlNXtbYOHrhUScCm3k-4sgM4XLC1dNfraS1pTbzVmoH6ZQ6MIY0TYIGTFvJaRoQ887CkOxYlBGqDB3cC18xHgMdl2PbCgzrwKkKtCaknAxdEpMm9xnj6XZBAEY8CQvj_8WxIKgTZGIdmZHEoqtIYh2ZU4pB1rSaOM9rTUvBbh6DqeuUQZPnX5HWVo0YTmmpkdSE72Qb2fu_6FYAhrxuXFLqstCF4waHxwJs4qjus56gUkUseJS9wav8KiQEZcJWEL02iCJY-QsGw1hgO1a_vSznuPUcr6CDx_RKR3bxwcp6lRRrH9ht2E2iWAFpiPwYNz8MtbxCwqziL9yCRlExd7HvBCmbaXbXFLU_LZUzEtMhxvS33Za3bU_Iz19rGR51vC5LgEUoIBGHlhdnyqbsBZ0Mfr_KiItLkXPjdkww0RKUXDor2Dh29oX3_iGkSuWRatHBeUPMOkfKlwIhj0tPAQFJ9Q9EEmRNkD1bOGqFvFvJsZKHYcibos4W4jQ65bSn7M4SQCX_8-wTiqIRw0YJzyn9iEEsr-8f1U5TUqU9ZtgtPLF_z2yUBnvuV63jDfgJOurxylkDlViBvnjcBtVuB-q1A_na7CfjxVqBxHSha2YL8iVMKja0AwNPNWwXx0NuXq8SDoby1okhfkcgMfTq76vr3UdN6rhUTPUbL3coEpeWfbT7I6Wy5RxO7tNqWrb3YgJvYBQxUaa-BZm--wPdXbrMtX9vDWvQFlJvbhg-ztwGs_VzhuDeV59EMcCaQ5LYH5_V59JKK37mabed-2h99BaG_f8PO6Z7LF1rjNieD6Ml4YtPAQANz9K3TMUaCZPezMxgbowFCMB501g5y0IpTnx_ryWutkWZnbpBqmMud2UFjIwt23Omgh34HdgNRfz_-Bw",
  demo1:
    "pVZtc6JIEP4vfHYj78FU7VWBksTNmZhYl-zl6mprxEE4keGGQWNS-e_XM7wICq5bxxel56Gf7p5--5BQkjxjmoYkHpIFlq6kjWrKA8WUelKClniEk4jsxgs4QAjN53NF1eDIJ3SNWPHFizNVQJYyQvGMIYZT6epDyuKQjRlew8tfHxLbJRwaE4bHcZIxwAsAV1wJp4QyoQn_m-HYw3QYoTS9wzsAJSGKyROJIjj3EF1MSRoysJpTvUlXX7SB3JMAqMqfn72KL00wWmFaZytEnKtdlW60afJIzCiJZhn1kYfrCo9OWnQqRqFU0YyG2jkBcF0bw14QEwcjNkFeEMb4B4-IhxiKyDIPxRGkgzNn_KJYpxnnqawdk3DpSb2qfFotihgK6ff1sery5CfqPz__ztUN8wC7vo89JnKrLUgg3pAoW4Mx8oXBsxc0wr_PXt2UE6giDp0IgGxDisGaGOwAg8EbntwH-XvBXx8yBu-_7YmFtMz8nOkCZYuQFMhaVubyEtvi6nkf1rjPwEOouXM3KIx5hAtf7YwRqHPwdYooWmOG6XhRnccLsp0l2BNXUtXny5jLheigRBVNFVdraLoIOC8cHLNZ-A6x_gCFCxZIV6ap96QAh8uAQS0qHJhCU8mABSItkt2nGD9xs6QrRjMMdxTCnUDS8Td-35XZ7iKErvQiTG0xyVSACyzSFbPTnoEMCVnao0Ja_ro9K7wT5dFph27ldqia2mmHbtXsUAy9xY4D2mZj-l9B0AyohCoIivJz8o4SPXRctgrHBydSQjfNGrsxOGJvVO9h2mmGwuuYt0L1ZObpDScNrY2m2UoOqDQD7BQ86kkeE-qg4jEv23j25dR1bXmb5OnYzqLI9cQ1oVv_auJy1RmloPoemtcwQHAWtU_sArfvFzV0nEVRhcjdac6dvJOk7gZ5GWwPcOajKAVr5smaT0xwI829-JDwDs88FIXxkjflgazJljHQLg1wVpaVHj9_8P0UC3DedC40ZWAYALvUZEPXi1TQL9RLXVN0A-KkqIpmcnehUO-hzYFxw2KUDSPirYDtOkLLovGJUj680kawVUtEe0lREvAGyYHFJTWMO77C0jXwJIlQjA_vFHj2NJyFW83tLPcuWLU69qofKcmoh2flbsVnSzG6d_xTcAyl2NRBgN-_rfrbR9u2nf7d9Qp-4eGv8Pj216-QoDWao_2nUPtPCrnay394-pYTZBYRPsXB0lB8HvAcwDGaR7Wr36Aoyycw5yqA6rlAvrmcBdTPBRrnAvnifBbw8lygdRooJvcC_452BOZ4CYC9OVzG6XX4Vn0ltrXq1sqZdCINXo-uun057fqep4tj31N_u3TK9LFt17lVdq_-m_3oVlJ36OrPLuAe3RJmuyM3AJo35xmePwqZO4z0N_jWvnsE1bns-vZ1M4Jvv9U4bhz1afIKOAdICtnt-OVp8rwT_4Vl8Du-mQ0m34OKFJ7rftPnqk11uvk4og_WA5vFlj1yJn_2-9ZEkGzf-6OpNRnZNryP-sHYHttLTn0Y1saq3EmzdVa2Zjn-1unbUys3dtrv27eDPi9USWQCoas0gTKcYcagk4jVjG9yz2KlvYvJHERFjkBFlru1g2glFm3LjfBGNPL9ZGgMpBmk3A0Nk3JU_Ac",
};
