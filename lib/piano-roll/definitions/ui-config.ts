import { SongKeySpec } from "wafer-host/unit-types";

export const appConfig = {
  isDevelopment: import.meta.env.DEV,
  isOnUnitsDevPage: location.href.includes("units-dev"),
};

const octaveCount = 5;

export const uiConfig = {
  numKeys: octaveCount * 12 + 1,
  numDiatonicLanes: octaveCount * 7 + 1,
  numPatternPitches: 7 * 3 + 1,
  patternPitchCenter: 7,
};

export const fallbackKeySpec: SongKeySpec = {
  root: 0,
  mode: "major",
  relativeKeyTranspose: 0,
};
