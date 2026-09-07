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
