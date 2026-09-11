export const appConfig = {
  isDevelopment: import.meta.env.DEV,
};

const octaveCount = 5;

export const uiConfig = {
  numKeys: octaveCount * 12 + 1,
  numDiatonicLanes: octaveCount * 7 + 1,
  numPatternPitches: 7 * 3 + 1,
};

export const debugConfig = {
  keyAm: false,
};
if (appConfig.isDevelopment) {
  // debugConfig.keyAm = true;
}
