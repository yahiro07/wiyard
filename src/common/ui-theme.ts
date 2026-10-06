export type UiTheme = {
  name: string;
  boardBgColor: string;
  boardBgImageUrl: string | null;
  boardBgMix: number;
  graphBgColor: string;
  graphBgOpacity: number;
  titleBarBg: string;
  deskAreaBg: string;
};

export const presetUiThemes: UiTheme[] = [
  {
    name: "theme1",
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg1.avif",
    boardBgMix: 1,
    graphBgColor: "#008",
    graphBgOpacity: 0.4,
    titleBarBg: "#999ea3",
    deskAreaBg: "#808488",
  },
  {
    name: "theme2",
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg2.avif",
    boardBgMix: 1,
    graphBgColor: "#144",
    graphBgOpacity: 0.5,
    titleBarBg: "#0ea5c4",
    deskAreaBg: "#808488",
  },
  {
    name: "theme3",
    boardBgColor: "#4c218c",
    boardBgImageUrl: "/images/bg3.avif",
    boardBgMix: 0.71,
    graphBgColor: "#004",
    graphBgOpacity: 0.26,
    titleBarBg: "#354f8d",
    deskAreaBg: "#808488",
  },
  {
    name: "theme4",
    boardBgColor: "#000",
    boardBgImageUrl: "/images/bg4.avif",
    boardBgMix: 1,
    graphBgColor: "#2a4492",
    graphBgOpacity: 0.46,
    titleBarBg: "#adb7ff",
    deskAreaBg: "#808488",
  },
];

export const defaultUiTheme: UiTheme = presetUiThemes[0];
