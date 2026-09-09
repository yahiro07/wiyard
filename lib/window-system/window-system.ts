import { windowSystemInternalHelper } from "./internal-helper";
import { createWindow } from "./window";

export function createWindowSystem() {
  const _helper = windowSystemInternalHelper;
  return {
    createWindow: createWindow,
  };
}
