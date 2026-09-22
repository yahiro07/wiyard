export type AppSettings = {
  uiScaling: number;
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
};

export const defaultAppSettings: AppSettings = {
  uiScaling: 1,
  wireVolumeKnobs: false,
  partControlBar: false,
};
