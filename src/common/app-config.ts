import { appEnvs } from "@/common/app-envs";

type DockPlacement = "leftInner" | "rightInner" | "bottomBar";

export const appConfig = {
  supportAutomationPorts: true,
  showAutomationTargetParameterSelectionMenuOnConnection: false,
  dockPlacement: "rightInner" as DockPlacement,
  minScaling: 0.1,
  maxScaling: 2,
  showWireConnectionPreviewFloatingWireEnd: false,
};
if (appEnvs.isDevelopment) {
  appConfig.dockPlacement = "bottomBar";
  appConfig.showWireConnectionPreviewFloatingWireEnd = true;
}
