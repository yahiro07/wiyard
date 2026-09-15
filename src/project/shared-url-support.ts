import { ProjectData } from "@/project/project-types";

export type SharedUrlSupport = {
  generateSharedUrl(): string;
  loadSharedUrlDataIfExists(): ProjectData | undefined;
};

function createSharedUrlSupport(): SharedUrlSupport {
  return {
    generateSharedUrl() {
      return "";
    },
    loadSharedUrlDataIfExists() {
      return undefined;
    },
  };
}
export const sharedUrlSupport = createSharedUrlSupport();
