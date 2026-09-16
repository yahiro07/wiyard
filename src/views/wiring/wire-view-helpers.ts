import { vectorOp } from "@lib/utils/geometry-helper";
import { splitConnectionKey } from "@/domain/port-helpers";
import { store } from "@/store/store";

export function useWireMiddlePoint(connectionKey: string) {
  const { portStuffs } = store.useSnapshot();
  const [sourcePortKey, destinationPortKey] = splitConnectionKey(connectionKey);
  const sourcePort = portStuffs[sourcePortKey];
  const destPort = portStuffs[destinationPortKey];
  if (!(sourcePort && destPort)) return null;
  const p0 = sourcePort.position;
  const p1 = destPort.position;
  return vectorOp.middle(p0, p1);
}
