export function isPortConnectable(
  sourcePortKey: string,
  destinationPortKey: string,
) {
  const sourcePortId = sourcePortKey.split(".")[1];
  const destPortId = destinationPortKey.split(".")[1];
  return (
    (sourcePortId === "audioOutput" && destPortId === "audioInput") ||
    (sourcePortId === "noteOutput" && destPortId === "noteInput") ||
    (sourcePortId === "automationOutput" && destPortId === "automationInput") ||
    (sourcePortId === "audioInput" && destPortId === "audioOutput") ||
    (sourcePortId === "noteInput" && destPortId === "noteOutput") ||
    (sourcePortId === "automationInput" && destPortId === "automationOutput")
  );
}
