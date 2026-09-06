import { createHostSystem } from "wafer-host/core";

export const hostSystem = ((window as any).hostSystemInstance ??=
  createHostSystem());
