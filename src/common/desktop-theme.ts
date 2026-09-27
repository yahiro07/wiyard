import { appEnvs } from "@/common/app-envs";

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
    bgColor: "#000",
    bgImageUrl: "/images/bg1.avif",
    bgMix: 1,
    graphBgColor: "#004",
    graphBgOpacity: 0.3,
  },
  theme2: {
    bgColor: "#000",
    bgImageUrl: "/dev/bg/bg15.jpg",
    bgMix: 1,
    graphBgColor: "#144",
    graphBgOpacity: 0.5,
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
  theme5: {
    bgColor: "#206",
    bgImageUrl: "/dev/bg/bg18.jpg",
    bgMix: 0.3,
    graphBgColor: "#004",
    graphBgOpacity: 0.25,
  },
} satisfies Record<string, DesktopTheme>;

export const desktopTheme = appEnvs.isDevelopment
  ? desktopThemes.theme2
  : desktopThemes.theme1;
