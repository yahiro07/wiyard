import { tryParseJson } from "@lib/utils/general-helper";
import {
  compressTextToBase64,
  decompressTextFromBase64,
} from "@lib/utils/string-compression";
import { productionFix } from "@/periphery/production-fix-wrapper";
import { projectDataIo } from "@/project/project-data-io";
import { raiseProjectLoadingError } from "@/project/project-error";
import { ProjectData } from "@/project/project-types";
import { appEnvs } from "@/common/app-envs";

export type SharedUrlSupport = {
  generateSharedUrl(): string;
  loadSharedUrlData(urlDataText: string): ProjectData;
};

export const projectDataTextSupport = {
  emitProjectDataText(projectData: ProjectData): string {
    const text = JSON.stringify(projectData);
    return compressTextToBase64(text);
  },
  parseProjectDataText(
    dataText: string,
    applyProductionFix: boolean,
  ): ProjectData {
    const decompressed = decompressTextFromBase64(dataText);
    const projectData = tryParseJson<ProjectData>(decompressed, () =>
      raiseProjectLoadingError(`failed to parse project data json`),
    );
    const appCompatible =
      "appVersionCode" in projectData &&
      "pageDeployId" in projectData &&
      "formatCode" in projectData;
    if (appCompatible) {
      if (applyProductionFix) {
        const res = productionFix?.hookProjectData?.(projectData);
        if (res === "blocked") {
          raiseProjectLoadingError(
            "the project is blocked to load due to potential crash risk.",
          );
        }
      }
      return projectData;
    } else {
      raiseProjectLoadingError("incompatible project data");
    }
  },
};

function createSharedUrlSupport(): SharedUrlSupport {
  return {
    generateSharedUrl() {
      const baseUrl = appEnvs.isDevelopment
        ? location.origin
        : appEnvs.cfPagesUrl;
      const projectData = projectDataIo.emitProjectData();
      const projectDataText =
        projectDataTextSupport.emitProjectDataText(projectData);
      return `${baseUrl}?data=${projectDataText}`;
    },
    loadSharedUrlData(urlDataText) {
      return projectDataTextSupport.parseProjectDataText(urlDataText, true);
    },
  };
}
export const sharedUrlSupport = createSharedUrlSupport();
