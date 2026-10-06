import { GraphElevationUnderlay } from "@/common/appearance";

export type AppSettings = {
  uiScaling: number;
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  mouseWheelZoom: boolean;
  graphElevation: boolean;
  graphElevationUnderlay: GraphElevationUnderlay;
  pianoRollWindowSideGrip: boolean;
};

export const defaultAppSettings: AppSettings = {
  uiScaling: 1,
  wireVolumeKnobs: false,
  partControlBar: false,
  mouseWheelZoom: false,
  graphElevation: false,
  graphElevationUnderlay: "frosted",
  pianoRollWindowSideGrip: false,
};

export type AppWorkspaceSettings = {
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  graphElevation: boolean;
  pianoRollWindowSideGrip: boolean;
};

export const defaultAppWorkspaceSettings: AppWorkspaceSettings = {
  wireVolumeKnobs: false,
  partControlBar: false,
  graphElevation: false,
  pianoRollWindowSideGrip: false,
};
