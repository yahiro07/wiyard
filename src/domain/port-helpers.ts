import { HsPortDirection } from "wafer-host/core";
import { store } from "@/store/store";

export function isPortConnectable(sourcePortKey: string, destPortKey: string) {
  const psSource = store.state.portStuffs[sourcePortKey];
  const psDest = store.state.portStuffs[destPortKey];
  if (!(psSource && psDest)) return false;
  if (psSource.unitId === psDest.unitId) return false;
  return (
    psSource.direction !== psDest.direction &&
    psSource.subtype === psDest.subtype
  );
}

export function getPortDirectionFromPortKey(portKey: string): HsPortDirection {
  const ps = store.state.portStuffs[portKey];
  if (!ps) return "input";
  return ps.direction;
}

export function getForwardDirectionWireConnectionKey(
  portKeyA: string,
  portKeyB: string,
) {
  const directionA = getPortDirectionFromPortKey(portKeyA);
  return directionA === "output"
    ? `${portKeyA}-${portKeyB}`
    : `${portKeyB}-${portKeyA}`;
}

export function filterUnitRelatedWires(
  wireConnectionKeys: string[],
  unitId: string,
) {
  return wireConnectionKeys.filter((key) => {
    const [sourcePortKey, destinationPortKey] = key.split("-");
    const [sourceUnitId] = sourcePortKey.split(".");
    const [destinationUnitId] = destinationPortKey.split(".");
    return sourceUnitId === unitId || destinationUnitId === unitId;
  });
}
