import {
  compressTextToBase64,
  decompressTextFromBase64,
} from "@lib/utils/string-compression";
import { appEnvs } from "@/common/app-config";
import { productionFix } from "@/periphery/production-fix-wrapper";
import { projectDataIo } from "@/project/project-data-io";
import { ProjectData } from "@/project/project-types";

type SharedUrlParseResult =
  | { status: "ok"; projectData: ProjectData }
  | { status: "error"; message: string };

export type SharedUrlSupport = {
  generateSharedUrl(): string;
  loadSharedUrlDataIfExists(): SharedUrlParseResult | undefined;
};

export const projectDataTextSupport = {
  emitProjectDataText(projectData: ProjectData): string {
    const text = JSON.stringify(projectData);
    return compressTextToBase64(text);
  },
  parseProjectDataText(
    dataText: string,
    applyProductionFix: boolean,
  ): SharedUrlParseResult | undefined {
    try {
      const decompressed = decompressTextFromBase64(dataText);
      if (!decompressed) {
        console.warn(`failed to decompress project data text`);
        return undefined;
      }
      const projectData = JSON.parse(decompressed) as ProjectData;
      const appCompatible =
        "appVersionCode" in projectData &&
        "pageDeployId" in projectData &&
        "formatCode" in projectData;
      if (appCompatible) {
        if (applyProductionFix) {
          const res = productionFix?.hookProjectData?.(projectData);
          if (res === "blocked") {
            return {
              status: "error",
              message:
                "the project is blocked to load due to potential crash risk.",
            };
          }
        }
        return { status: "ok", projectData };
      } else {
        return { status: "error", message: "incompatible project data" };
      }
    } catch (error) {
      console.warn("error parsing project data text", error);
    }
  },
};

function createSharedUrlSupport(): SharedUrlSupport {
  return {
    generateSharedUrl() {
      const baseUrl = appEnvs.cfPagesUrl || location.origin;
      const projectData = projectDataIo.emitProjectData();
      const projectDataText =
        projectDataTextSupport.emitProjectDataText(projectData);
      return `${baseUrl}?data=${projectDataText}`;
    },
    loadSharedUrlDataIfExists() {
      const url = new URLSearchParams(location.search);
      const text = url.get("data");
      if (text) {
        return projectDataTextSupport.parseProjectDataText(text, true);
      }
    },
  };
}
export const sharedUrlSupport = createSharedUrlSupport();
