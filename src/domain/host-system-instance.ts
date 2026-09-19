import { createHostSystem, HostSystem } from "wafer-host/core";
import { createCustomSequencerTickDriver } from "@lib/wafer-ex";

export const hostSystem = ((window as any).hostSystemInstance ??=
  createHostSystem()) as HostSystem;
export const sequencerTickDriver = createCustomSequencerTickDriver(hostSystem);
