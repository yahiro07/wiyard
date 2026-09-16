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

export function splitConnectionKey(wireConnectionKey: string) {
  const [former] = wireConnectionKey.split("#");
  const [sourcePortKey, destinationPortKey] = former.split("-");
  return [sourcePortKey, destinationPortKey];
}

export function filterUnitRelatedWires(
  wireConnectionKeys: string[],
  unitId: string,
) {
  return wireConnectionKeys.filter((key) => {
    const [sourcePortKey, destinationPortKey] = splitConnectionKey(key);
    const [sourceUnitId] = sourcePortKey.split(".");
    const [destinationUnitId] = destinationPortKey.split(".");
    return sourceUnitId === unitId || destinationUnitId === unitId;
  });
}

export function decodeWireConnectionKey(wireConnectionKey: string) {
  const [former, destinationParameterId] = wireConnectionKey.split("#");
  const [sourcePortKey, destinationPortKey] = former.split("-");
  const [sourceUnitId, sourcePortId] = sourcePortKey.split(".");
  const [destinationUnitId, destinationPortId] = destinationPortKey.split(".");
  return {
    sourcePortKey,
    destinationPortKey,
    sourceUnitId,
    sourcePortId,
    destinationUnitId,
    destinationPortId,
    destinationParameterId,
  };
}

export function getWireVolumeUnitId(wireConnectionKey: string) {
  return `wg_${wireConnectionKey}`.replace(/[.-]/g, "_");
}

export function portKeyEquals(portKeyA: string, portKeyB: string) {
  return portKeyA.split("#")[0] === portKeyB.split("#")[0];
}
