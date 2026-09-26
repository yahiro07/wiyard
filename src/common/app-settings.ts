import { GraphElevationUnderlay } from "@/common/appearance";

export type AppSettings = {
  uiScaling: number;
  wireArrow: boolean;
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  mouseWheelZoom: boolean;
  graphElevation: boolean;
  graphElevationUnderlay: GraphElevationUnderlay;
};

export const defaultAppSettings: AppSettings = {
  uiScaling: 1,
  wireArrow: false,
  wireVolumeKnobs: false,
  partControlBar: false,
  mouseWheelZoom: false,
  graphElevation: false,
  graphElevationUnderlay: "frosted",
};
