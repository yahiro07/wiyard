import { appEnvs } from "@/common/app-envs";
import { assignTyped } from "@lib/utils/array-object-helper";

type DockPlacement = "leftInner" | "rightInner" | "bottomBar";

export const appConfig = {
  supportAutomationPorts: true,
  showAutomationTargetParameterSelectionMenuOnConnection: false,
  dockPlacement: "bottomBar" as DockPlacement,
  minScaling: 0.1,
  maxScaling: 3,
  showWireConnectionPreviewFloatingWireEnd: true,
  maxNoteChannels: 4,
  maxAutomationChannels: 4,
};

export const featureFlags = {
  // graphAreaElevation: false, //adopted, moved to settings
};

if (appEnvs.isDevelopment) {
  assignTyped(appConfig, {
    maxNoteChannels: 6,
  });
}
