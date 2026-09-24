export type AppSettings = {
  uiScaling: number;
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  mouseWheelZoom: boolean;
};

export const defaultAppSettings: AppSettings = {
  uiScaling: 1,
  wireVolumeKnobs: false,
  partControlBar: false,
  mouseWheelZoom: false,
};
