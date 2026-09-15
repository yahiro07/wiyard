import { typedAssign } from "@lib/utils/array-object-helper";

declare const __CfPagesUrl: string;

function extractPageBuildId(url: string): string {
  return url.replace("https://", "").split(".")[0];
}

export const appEnvs = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  cfPagesUrl: __CfPagesUrl,
  cfPagesDeployId: extractPageBuildId(__CfPagesUrl),
  appVersionCode: "v260916",
};
if (appEnvs.isDevelopment) {
  typedAssign(appEnvs, {
    cfPagesUrl: "https://aaabbb123.wireboard.pages.dev",
    cfPagesDeployId: "aaabbb123",
  });
}

export const appConfig = {
  supportAutomationPorts: false,
};
