import { HsPortDirection } from "wafer-host/core";

export function isPortConnectable(
  sourcePortKey: string,
  destinationPortKey: string,
) {
  const [sourceUnitId, sourcePortId] = sourcePortKey.split(".");
  const [destUnitId, destPortId] = destinationPortKey.split(".");
  if (sourceUnitId === destUnitId) return false;
  return (
    (sourcePortId === "audioOutput" && destPortId === "audioInput") ||
    (sourcePortId === "noteOutput" && destPortId === "noteInput") ||
    (sourcePortId === "automationOutput" && destPortId === "automationInput") ||
    (sourcePortId === "audioInput" && destPortId === "audioOutput") ||
    (sourcePortId === "noteInput" && destPortId === "noteOutput") ||
    (sourcePortId === "automationInput" && destPortId === "automationOutput")
  );
}

export function getPortDirectionFromPortKey(portKey: string): HsPortDirection {
  const [_, portId] = portKey.split(".");
  return ["audioOutput", "noteOutput", "automationOutput"].includes(portId)
    ? "output"
    : "input";
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
