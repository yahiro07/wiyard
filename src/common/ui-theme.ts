export type UiTheme = {
  boardBgColor: string;
  boardBgImageUrl: string | null;
  boardBgMix: number;
  graphBgColor: string;
  graphBgOpacity: number;
};

export const uiThemes = {
  basic: {
    boardBgColor: "#000",
    boardBgImageUrl: null,
    boardBgMix: 0,
    graphBgColor: "#222",
    graphBgOpacity: 1,
  },
  theme1: {
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg1.avif",
    boardBgMix: 1,
    graphBgColor: "#004",
    graphBgOpacity: 0.3,
  },
  theme2: {
    boardBgColor: "#000",
    boardBgImageUrl: "/dev/bg/bg15.jpg",
    boardBgMix: 1,
    graphBgColor: "#144",
    graphBgOpacity: 0.5,
  },
  theme3: {
    boardBgColor: "#000",
    boardBgImageUrl: "/dev/bg/bg5.jpg",
    boardBgMix: 1,
    graphBgColor: "#0086",
    graphBgOpacity: 1,
  },
  theme4: {
    boardBgColor: "#fff",
    boardBgImageUrl: "/dev/bg/bg22.jpg",
    boardBgMix: 0.8,
    graphBgColor: "#fff",
    graphBgOpacity: 0.2,
  },
  theme5: {
    boardBgColor: "#206",
    boardBgImageUrl: "/dev/bg/bg18.jpg",
    boardBgMix: 0.3,
    graphBgColor: "#004",
    graphBgOpacity: 0.25,
  },
} satisfies Record<string, UiTheme>;

// export const uiTheme = appEnvs.isDevelopment
//   ? uiThemes.theme5
//   : uiThemes.theme1;
export const defaultUiTheme: UiTheme = uiThemes.theme1;
