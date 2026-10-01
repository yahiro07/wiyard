import { createHostSystem, HostSystem } from "wafer-host/core";
import { createCustomSequencerTickDriver } from "@lib/wafer-ex";

function createHostSystemInstance(): HostSystem {
  return createHostSystem();
}

export const hostSystem = ((window as any).hostSystemInstance ??=
  createHostSystemInstance()) as HostSystem;
export const sequencerTickDriver = createCustomSequencerTickDriver(hostSystem);
