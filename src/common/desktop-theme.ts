export type DesktopTheme = {
  bgColor: string;
  bgImageUrl: string | null;
  bgMix: number;
  graphBgColor: string;
  graphBgOpacity: number;
};

export const desktopThemes = {
  basic: {
    bgColor: "#000",
    bgImageUrl: null,
    bgMix: 0,
    graphBgColor: "#222",
    graphBgOpacity: 1,
  },
  theme1: {
    bgColor: "#206",
    bgImageUrl: "/dev/bg/bg18.jpg",
    bgMix: 0.3,
    graphBgColor: "#004",
    graphBgOpacity: 0.25,
  },
  theme2: {
    bgColor: "#000",
    bgImageUrl: "/dev/bg/bg3.jpg",
    bgMix: 0.8,
    graphBgColor: "#004",
    graphBgOpacity: 0.4,
  },
  theme3: {
    bgColor: "#000",
    bgImageUrl: "/dev/bg/bg5.jpg",
    bgMix: 1,
    graphBgColor: "#0086",
    graphBgOpacity: 1,
  },
  theme4: {
    bgColor: "#fff",
    bgImageUrl: "/dev/bg/bg22.jpg",
    bgMix: 0.8,
    graphBgColor: "#fff",
    graphBgOpacity: 0.2,
  },
} satisfies Record<string, DesktopTheme>;

export const desktopTheme = desktopThemes.theme1;
