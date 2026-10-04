export type UiTheme = {
  boardBgColor: string;
  boardBgImageUrl: string | null;
  boardBgMix: number;
  graphBgColor: string;
  graphBgOpacity: number;
  titleBarBg: string;
  deskAreaBg: string;
};

export const presetUiThemes = {
  basic: {
    boardBgColor: "#000",
    boardBgImageUrl: null,
    boardBgMix: 0,
    graphBgColor: "#222",
    graphBgOpacity: 1,
    titleBarBg: "#718096",
    deskAreaBg: "#808488",
  },
  theme1: {
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg1.avif",
    boardBgMix: 1,
    graphBgColor: "#004",
    graphBgOpacity: 0.3,
    titleBarBg: "#718096",
    deskAreaBg: "#808488",
  },
  theme2: {
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg1.avif",
    // boardBgImageUrl: "/dev/bg/bg15.jpg",
    boardBgMix: 1,
    graphBgColor: "#144",
    graphBgOpacity: 0.5,
    titleBarBg: "#718096",
    deskAreaBg: "#808488",
  },
  theme3: {
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg1.avif",
    // boardBgImageUrl: "/dev/bg/bg5.jpg",
    boardBgMix: 1,
    graphBgColor: "#008",
    graphBgOpacity: 0.4,
    titleBarBg: "#718096",
    deskAreaBg: "#808488",
  },
  theme4: {
    boardBgColor: "#fff",
    boardBgImageUrl: "/images/bg1.avif",
    // boardBgImageUrl: "/dev/bg/bg22.jpg",
    boardBgMix: 0.8,
    graphBgColor: "#fff",
    graphBgOpacity: 0.2,
    titleBarBg: "#718096",
    deskAreaBg: "#808488",
  },
  theme5: {
    boardBgColor: "#206",
    boardBgImageUrl: "/images/bg1.avif",
    // boardBgImageUrl: "/dev/bg/bg18.jpg",
    boardBgMix: 0.3,
    graphBgColor: "#004",
    graphBgOpacity: 0.25,
    titleBarBg: "#718096",
    deskAreaBg: "#808488",
  },
} satisfies Record<string, UiTheme>;

export const defaultUiTheme: UiTheme = presetUiThemes.theme1;
