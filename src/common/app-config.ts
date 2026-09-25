import { appEnvs } from "@/common/app-envs";
import { assignTyped } from "@lib/utils/array-object-helper";

type DockPlacement = "leftInner" | "rightInner" | "bottomBar";

export const appConfig = {
  supportAutomationPorts: true,
  showAutomationTargetParameterSelectionMenuOnConnection: false,
  dockPlacement: "bottomBar" as DockPlacement,
  minScaling: 0.1,
  maxScaling: 2,
  showWireConnectionPreviewFloatingWireEnd: true,
  maxNoteChannels: 4,
  maxAutomationChannels: 4,
};

export const featureFlags = {
  graphAreaFloatUp: false,
};

if (appEnvs.isDevelopment) {
  assignTyped(appConfig, {
    maxNoteChannels: 12,
  });
  assignTyped(featureFlags, {
    graphAreaFloatUp: true,
  });
}
