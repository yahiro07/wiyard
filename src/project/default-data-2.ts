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
    "pVptc9rKDv4vfG2b4BeM6cy5M2tDgpPQhNCmTe_cOeOAMS5gU9uEpJ3-9_to_RK_LZC050yLtdI-klYradf-3bI3mzsnjLzAN4OZ0_rYepS1dk_SWu9bG9t1-s5mFTxbMwzYtv3w8CDJCobmQbi241Tiq3EjgRbFQehMYjt2otbH362t78VW7Kzx8N_frfh5Q6x-EDuWv9nG4OcMNHFOvAnCmM_k_Nw6_tQJzZUdRZfOM5g2nu0Ht8FqhfGpHc5ugsiLoTVBPbU-fpB77fctMLb__Hmfw0Ubx146YREsJRFU80xSR05m0rqluaaBH4fBarIN5_bUKU5ZG2nST20ns0rt0qwPAXiLk4X2DJbGt9G_5ImpHdurwE1ckA8JFE8BtP0AbmhvFl7s9MPtemRPF57v1KEamJpB5dRZXb2Eenid5b9c54qZhwEpbP8GUJFfCaj-JaBajr_aQkbezJkubA8bd70JnSgKwvpCNjA1w3az-DwQPjv70aHdby6cKfZRHbHCIIhVpZt6tbMfLg58bFbbx991qMJgM4yeRmfnwKbjE03seBvaJC1AemFoRuulC1dJHM1oV94a-0tkVDoqcJ6cbvWjgD57q3jwU4CTDAq2dlNGbca4dR6d8EGAkQwKok5Pw0B5fdKiDPJ3SUtTXxfrNcSjYl3XErQPB2y0V7Hthd_WdTdmI3vzfiU_7Q2GmiFHB8MhlJfyVcM4rnwdynpFMyilv82MQ1muiEJ5_G0oh2xZezNv8uzHi_qS50N7nbV_-kUQer-aslk6cKD_OZQ0_UepPjWIgrImdQqb7n_JPGbSOQ3mc2ca866x2P7g8TFYbddAb5_Al6U_CvWnmPxD-0T5817Q1ZRm0PRUpC3gl8v8XanAX9icJSYln_RE7oCvGP8lxo76onC7B87i4pdxOzku2HZe6MBNPhwEZ8LJ1E9XWqkTerzexnj-T8GBnJz1KI0OOrG3My9IJUulNhnJhBuGikLFytkgWB8uCueFsEGyMpaK1VqQE8o1Yh3r_BSjpcJ1rCMae666cHnafUsgl4Sbp5-YRyHXqhV3S7kHLkbKS0iXAmWP4wtnp7JlhalqvshKTsPylocOe7_cXjdHfbIZmmCUI1wt1LEsXHc1RVRx64nckM6TQRT1FomoYq3SoSM3cNYJvsndSZCkQoXcVXJ3kS4y5_h9ntevogQqB6XEc6wcLxh_sSMpK8t_lRlpBlSJV5tN1Qhyr99qHDCtCmwbB7iEQVq9sUN77WASa0Y-4eP-LNhNNs6UOyk_cn7ldE4ql2cVjqBjPFUmus9w_Hji_UI9-o25ZmhD6OICBXzheO4CemhoDt63fl2HM7S9HzVU4wg3P1ugwRs-TPrlULMwDx3nlnRsfYzDrYPC5sGL6B7oKYV6uToRapd1OyLdlA5qZqaaLJGHMtUgmmvmw990r1XWwc79OJh5uMN6sxa9ooNwxihogcWuanHINUvnmbdcQnV66CioyeRAzRqpdLzKNJI6akEj9C0H_FJpxaoB08EMdKqRO7oQHy3kC74iEWOGX4wYjo-x5huNOrZGm453qLTSAmhqkXPTtRI0giXHfvQi72HF4etXG3VoXdZSs3XthBq-I9BllRjzUMAETej1O4gG9C7cBnS5rQmhZQVb-SUK5SJ0MQyr0C8XEg2hRpJktbQnP9AxN3d4KT2QM4S4-f1EA2w3QVVxWnsDbHGZsxATnhMq0B-UBLvXOXqVlWLagXQNu3xV0rClpF5ib08c1rIqNBfCTU4WnnSqFneUBF7p9d5mM-KuZnP9CqXJ11qSyj6o8ls3VTGdFYwvH9uquL12spkliTLjMaC9Ygqlc_KhsG6yV1URmdxcXH6-ZTs1Obpy8Kya2pWwqEm90JU9Plb1QiVV2t1i2iym7IK5lYNs3clZoVDEyaPi5WK2pk1xyMtKA7Ckp7tJ0d6UtBCSNSe_3KjU8WRFTT2M3CFG1MiNLyWZ8ngeT8V1LViaXLQ0uJZKCZVBdd-u0VRw5YBduizJV7Roo8C1alP97aVFUNLFdWiPa4sVMHEtzbINQ8zyCccJc0G99qr5pVHK99L9Frj97WqVcySNE5-k2v9mDXI0eLSnW7yxBNPcXkXowh42a3o9QVs7Uf13y3l2JlN75fku77_bqqJ0ekoXzU27jbqI4ev5PHI4LwUCboW6qqJ11K4s6Sq1ptxXyommYDMgALQeciy6oaTL-4TeHTqadL3LL8VWwXQJsLOV7fLuveyCf6NgG06dSfZmKWsfy6e1Zi4A8p6yuulLrb2s88XidYNOEMSYLnHJThSM_GK7mMdeXKVpeldFRtE6cldqdxHem5XtO9VA6XTVk57e0xS8z1DavLkrxI1yImndjq4reCmtScof8hq5KXvTjJfLgjfJNR8gstO7zGcShTPsyNEQ4S3n18Xy9Jkxw2X4i90zNhgP6MFj4zPG-iODfWHslllGxIyvzD1zjdPLsyWYd4yNLcPYMZPtBkM8nLPxlBnjKdGGpks094popqsS7arP-XafiNYfL4l2bYyJphugGYx0GDM2Z__8g90oMq8eCEeYh_8tk0z55FoGrIRu54yZY5M9sKEewGziAcWCOhb-U8lC19xhwIRSY4tGGRvu9qmmvFK1nx5XzYRqsH3ELHPMjAFzL3bs7N7EGvTbwVd4BGT8IU8NyFNQ3jLhvT6er-Ey0FR43jL7LoNVgyvG4M1xBM0t09wNzER3Q9-juvpK1Rfw6oixsyvXghGuzDyLmZ_d_gWALDZChAx-sGfo7d2boPUvOW0cEs34wYhvONoRLegSbThWzQuXXd241pr1P72DHNnShyu-s93IZ0ZwzrwpO98BY8emJqepY_Y8ZcOnEdEW5ww003og2sgA7o49O8THOmvmLdnZ8N68HLPP091owwwaXbLBedQH7cZmoDEJOi9Z_xz6jtmPoWttWP9MJdrlF5Vkbx9cK2RmBxgRuxxAdseWYzYC7a5PtIslMHbMn3DaBvqBTxoRX3THZaV7ol1JqnnFjNEZ30w8IvtYUgO2UgSeMxfLDFtBG8BW0L5cMxd8LkKAdskEYQIZhMmahC0T_EvmAqchSmtfaqRL-yPib0P4P1TusvuUySqg1xJIMR4XX9A1n-PbqJMvFePRXm2TK37CShmpUh3FSO-wjmKk11BHMXaOZaRvfI5i7B7LqO9n5Hd3M-fKfg7oLitlwIcRnutHZ95TLsXfO-Wrlt2E7NmK97tqrix_RyOSQ3ZH3BmnP9nsdK5Q_kXoIdX8HL4LDKV3Ot9RmA2w9yw211xjDhobDxB5AxZcXcQYu51pOmPfNqdsCH5Fr-gh-txGpNGcAvf-6XRwSznuXKEMhqxo3A97g1tKNV-eTrfdCNlx-NldsPFhNP5y5Bg0ZqznTxyNffdTtEGKlo6JfLwPg_t4tDrt7Wa7go_7M-3uC_u1IB9TVje-MzQOtjucw4-Zj2Vp5ZD_-6oasG9Pp-zOvr4fVn1c_UhEqMm3RsnKhx9iO_q6XYuz2sccQvH57KFBtPB5hlDys3nbIFn46EIoefsUW-OqyqUPDYSiO2PJulPDQafD7IXp0YrcnJ4OvmF1sGPEpuyNBVv-LJakXCiUnH53xZKUHIWSzkXFfaIvp8Qrb97d_7Da735U46f8Bv9ANeHN_DqYfU3vRPiNCZ7PwqTZoMtlTriOpjjv5b9xoE9-94MtndCyxAnKeGvPwu2mQAwgWwIgwvU0BolfQ9Nj34m3OHXRrPQ48vgXBcmTXBWWM-F0PBP-wL9CIgqXx-851gJfuuFgNp_jBuykrXZ6OEz0VB33lvSKIGEY87N18nsUwIu56MB_xOEQp0PHf2Scjh_97MckVRI_b8tCCW_-CAl6r5M_Q7A4nAjPQi81Kky-T6Kf2Uv4xBmp3XTkoMoVhMtog7Zh4sQxDjh8Nek9zB0XuvSDB5DSq3w7zL5tMGycvdK14dl5sHIek4_I8nv_0uF0guA8D71NemL7838",
};
