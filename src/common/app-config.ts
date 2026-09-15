import { typedAssign } from "@lib/utils/array-object-helper";

declare const __CfPagesUrl: string;

function extractPageBuildId(url: string): string {
  return url.replace("https://", "").split(".")[0];
}

export const appConfig = {
  isDevelopment: import.meta.env.DEV,
  supportAutomationPorts: false,
  cfPageUrl: __CfPagesUrl,
  cfPageDeployId: extractPageBuildId(__CfPagesUrl),
  appVersionCode: "v260916",
};

if (appConfig.isDevelopment) {
  typedAssign(appConfig, {
    cfPageUrl: "https://aaabbb123.wireboard.pages.dev",
    cfPageDeployId: "aaabbb123",
  });
}
