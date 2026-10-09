import { raiseProjectLoadingError } from "@/project/project-error";
import { ProjectData } from "@/project/project-types";

export function migrateProjectData(projectData: ProjectData): ProjectData {
  if (projectData.appVersionCode === "v20260901") {
    raiseProjectLoadingError(
      `cannot migrate data, data version is too old: ${projectData.appVersionCode}`,
    );
  }
  for (const spec of Object.values(projectData.storeStates.windowSpecs)) {
    if (spec.zOrder === undefined) {
      spec.zOrder = 0;
    }
  }
  return projectData;
}
