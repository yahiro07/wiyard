import { GraphElevationUnderlay } from "@/common/appearance";

export type AppSettings = {
  uiScaling: number;
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  mouseWheelZoom: boolean;
  graphElevation: boolean;
  graphElevationUnderlay: GraphElevationUnderlay;
};

export const defaultAppSettings: AppSettings = {
  uiScaling: 1,
  wireVolumeKnobs: false,
  partControlBar: false,
  mouseWheelZoom: false,
  graphElevation: false,
  graphElevationUnderlay: "frosted",
};
