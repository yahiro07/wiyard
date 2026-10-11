import { GraphElevationUnderlay } from "@/common/appearance";
import { pickObjectMembers } from "@lib/utils/array-object-helper";

export type AppSettings = {
  uiScaling: number;
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  mouseWheelZoom: boolean;
  graphElevation: boolean;
  graphElevationUnderlay: GraphElevationUnderlay;
  pianoRollWindowSideGrip: boolean;
  syncToExternalMidiClock: boolean;
};

export const defaultAppSettings: AppSettings = {
  uiScaling: 1,
  wireVolumeKnobs: false,
  partControlBar: false,
  mouseWheelZoom: false,
  graphElevation: true,
  graphElevationUnderlay: "frosted",
  pianoRollWindowSideGrip: true,
  syncToExternalMidiClock: false,
};

export type AppWorkspaceSettings = {
  wireVolumeKnobs: boolean;
  partControlBar: boolean;
  graphElevation: boolean;
  pianoRollWindowSideGrip: boolean;
};

export const defaultAppWorkspaceSettings: AppWorkspaceSettings =
  pickObjectMembers(defaultAppSettings, {
    wireVolumeKnobs: 1,
    partControlBar: 1,
    graphElevation: 1,
    pianoRollWindowSideGrip: 1,
  });
