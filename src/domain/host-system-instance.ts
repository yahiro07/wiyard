import { createHostSystem, HostSystem } from "wafer-host/core";

export const hostSystem = ((window as any).hostSystemInstance ??=
  createHostSystem()) as HostSystem;
