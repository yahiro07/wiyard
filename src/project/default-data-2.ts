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
  demo2:
    "pVprc9q8Ev4vfG2T4CvQmffMyIYEktCE0KZNz5x5xwFhXMCmtglJOv3v51nf8E1A0vQSe7WrZ3e1Wq0k_25Y6_U99wPHc01vyhufGk-y3uxIeuNjY23ZvMvXS-9lMEWDZVmPj4-SrKBp5vkrK0wkvhm3EmhB6Pl8HFohDxqffjc2rhMOQr7Cy39_N8KXNbG6XsgH7noTgj9ioI4z4q3nh1FP_NeGuxPum0srCK74C5jWjuV6d95yifaJ5U9vvcAJoTVBPTc-ncid5scGGJt__nzM4II1txbcz4MlJIKq70nS5LgnvVXoa-K5oe8txxt_Zk14vstKS51-ajPuVWoWen30wJvvzLemsDS8C_4lT0ys0Fp6duyCrEmgeAKg7wewfWs9d0Le9TeroTWZOy6vQtUw1YPKibNa7QLq4XGW_3KcS2YeBqSw_RtARX4joPqXgGox_ioDGThTPplbDibuau3zIPD86kDWMNXDttL4PBA-W-uJ0-w353yCeVRFLDEIYlXREq9q--FCz-X-2Ao3vkXiVbgSQz1cJ3FpaUrXo107K0R-jWX5VoFZcjIJjwL64izD3i8BTtwomHR1ua4e444_cf9RgBE3CuKhnQyQ8vZ0QnP779KJrr4tCiuIR0VhW4_RTg7YaC1Dy_G_r6puTFv2ZuRS5tgbDBVDjg6GQyi7haWCcdzCcigf5c2gZPs-Mw7lnzwKZdj3oRyyZeVMnfGLG86rQ5417XXW_u7nnu-81mWzpOFAZaIdqCHcJ6naNYiCBUdKcvGhSRd5995bblY1FUOuUTDZkgVGk4Dyv7hbM66cerMZn4RR1Zgvf_D6FHf4qXmKESv8KFSfou-T5qny56Ogqin0oLcTkaaAXy7yt6Qcfy4FFJiUrNNTWQNffpYVGDV1p3CzA858iBVxtQwXbFvH53CTCwfBl_A11dOlUuqUXm82Id7_k3NgRE5rlMpCemptpo6XSBUXvripIFlqS8QqxcBpVNbVFSZVuHRpKqLVDkxBuL77sXkUcmXhiDQuFop5d-7GverNep_kNhhFy3JdVXyRZv-iRLGcrB_lePALeqU5-AivVQe6VrjqNZr_-VATWZT0k0Lk9RaJqHucEI9CIpSbQQUn5OkikONjPMvVYmfVwKRpUixU44DDQolvDgvV5sM3IRan55FCxSZhlqDoEfMLUlUMhJWDUuIFIjlaMP4i2VBWlt8RLrSWYG14ew4gQCnJ6WwTejhCgX23lm-tODoZTMmiqN2detvxmk8iE7MN47eIHpFKlUErrmpopaLTCO6GY-cVq8lv9DVFqULHDlh-59yx59BDRwHxsfF6409RGn-SVJ1Ob-BwwMEdLmx65bT0z3zO70jJxqfQ33CsSw5WItQC9JZg7U4-hOqlJZFIOUXDkpfqJkvkolQ3iGaauXA4HUsVdbAyR_amDo6g3q1FJ-8hbETyHqpqccg1C_4SFVBCdbQOYo8GTaO6oV4llTZhqUqSpuZVIm0zpZ6cwHlc1ninVE-VdWihfKENkNzWhUqg2twpoUjtnBJtjFvRMWisP5eogusa3BpVszTgAmwqpzMH6HlspQ67ejpRxW2TZGS03j4V-74ALavEuPM9qs-K78FQPa2og48nq9wUu1xWEBu7UJRz2J3OHujd0UUVtyPF7j6RqPoUZAnaEGfuLiSJzj6Ts5OMGtjY2hMV-7p3wNYNsrDWL0GfdJqJyZqmHD3SSj79dFC1V_CLBytVXFXCGBFsRxzYsir29JEmRxuMssmaEmMrnc77LEbgHZxVtciKllitysdDF6ZVJ59mcyFW3HtVBxmrFx0cSJQejwHt5PNoa998yg5lagZZTbKIihPMdwS2VOfo0u6xbKquS6cxqqrv87FKeTnL2M1WIXXlcXP2lrajVS-nK4UiTh8lN-ezdQtp4JCblbrKpp1ElaK_K23Vzd_d6UsVT1bUxMUnSkuMqCtIh7uFmTJ5tibCUXWWxocyNa5NsoXW3Lca6VSjZYAtOvLYDalg3hSPymoW4E48c06kPav_Ht_mq8ZCbszOiKqYcBtlJwoNQRUG96VwhYmqV_MidbLxfXTyGds_c26h9FnWXzUlfLuqO8ftbpbLjCOu16JOynV3WpgHvSdrssE9J5hm1jJA8fe4XtGlBpVkseq_G_yFjyfW0nHt6Piq08G1qtJCMYUfWorRfjObBTxiju4OTnUF51rtJuoS_JaTwUFU6C1V0mVNl1otFVVDXF1-xqYBSpp09hydpS29yQJo50vLjrYNRR_8G3gbf8LH6YVUWrYWt9f1XACMatlyminsKWQona5UtHUhxmSIC3aeaNmpe6Ek2PlK19stFTlM1-SW1GwhYa2XlsvLgQkOuEbV2pqitxU9NyHblCdVTZUk6CSjoz_kM3JSej2NG2nB9XPFA4jp5Dz0hUThCivgOuZTg79eLs5eGDNshv_YA2O9UY9eHDY6Z6w7NNhXxu7YwAiY8Y3Z57a5vDpfgHnL2GhgGFtmsm2vj5cLNpowYzQhWt-0iWZfE820VaJddyO-7WeidUcLot0YI6K1DdAMRjrgZ8b--QfzUGReNQyOMA9_ByaZ8tkeGLASul0wZo5M9sj6nVE3sh4_5gDqDPBHJQttc8t6MHAEU2Pd-tt9qilvVO2XE8GaUA22D9nAHDGjx-zLLTt_MDEG3ab3bUR6EjZ5qkeegvIDE96D1r0beB40FZ4fmF2bwareNWPw5iiA5gPT3PbMWHejvUd19Y2qz-HVIWPn1_YARtgycwbM_GJ3LwE0YENESO8ne4HezoMJWvcqoo18ohk_GfH1h1uieS2i9UeqeWmz61t7sGLdzx8gR7Z04YofbDt0meFdMGfCLrbA2LKJGdHUEXuZsP7zkGjzCwaaOXgk2tAA7pa9cOJj2oo5C3befzCvRuzLZDtcM4NaF6x3EXRBu7UYaEyCzgvWvYC-I_azbw_WrHuuEu3qq0qyd4_2wGemBoyAXfUgu2WLERuCdt8l2uUCGFvmjiPaGvqBTxoSX3AfyUoPRLuWVPOaGcPzaDJFEdnFkBqwlSLwgtkYZtgKWg-2gvb1htngsxECCEg2RphABmGyIuGBCf4Fs4FTE6WVzzuSof0ZRBc10S9a6NJjnPHSo7sMpBgnEp_TaRd3LazKuwXjyVpu4nsBwkoYaaE6ipGu145ipBuyoxi1Yxnpw6CjGFvHMrb3M0YHflN-bb14dISWMOBrCsd2g3PnOZOK7q6yUUvPX_ZMxYdtOVeKvo0R9TCjgHl4PuvdUW65UChzIBsZD_1O746m-Nfns00rQFbqf7HnbHQYjULgKDRmrGbPERr74SZovQQtaSuiFT8sEmFg5cKcMs5-senZTKG1BdMKafRX_4NnKJ2z2Zawe8grAzbTbWMGGhsBEv-868sQbXdTvc3Y9_UZFgfqo-Tj4j30Xj2Gy7POdrrN6dGd6vdf2euc9KCsbvxgKBssuz8DVqqHLC056dhVVY99fz5j99bNQ7-sR_GK98CcjgqqlTf9luyEo30y3s_9OOXTwWJEuAkmKHuzZ2zj4ueut6GqPA1fUEYba-pv1jmiB9kCABFuJiFI0REkvXZ5uEHpS73S69CJrpzjN7ksLKfCSXsqfBJ9pkKUSB7PM-wS8JESquPZDJu106aK48l2s6O2262otIoZRtGGKn4eevBiJtpzn1Cio2Tl7hOL6Hjopg_jREk83hWFYt7sFRJ0JJ-9QzDfHAtPfScxyo8_YKHH9P40dkZit0KFX27MyzfYwuj7Xo6Wuu-QxLHbbVuV3FL5tkgoPps-1ojmvhYSSn4x72okc98ACSXvnsPBqKxy4bsXoejWWLDWxOC2ccasuenQLLw9O-t9x4xEJil2KfpoTexL8_7h56D54WftiOS-mhH2YMlfxJK0kgolJz9ssSQtrUJJfomBoJXL8xfBGmXDmIchtjdRHqHrnzgIr1zvEaRk_iPbpF9EGBa2Xgk5WiZ6S_4Uf-CWXTcUNqdj-PXCd9bJhu3P_wE",
};
