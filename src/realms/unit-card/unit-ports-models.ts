import { isPortConnectable } from "@/domain/port-helpers";
import { PortStuff } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { Point, startDragSession } from "@/utils/drag-session";

export function findNearestPort(portStuffsArray: PortStuff[], pos: Point) {
  let nearestPort: PortStuff | null = null;
  let nearestDist = Infinity;
  for (const port of portStuffsArray) {
    const dist = Math.hypot(port.position.x - pos.x, port.position.y - pos.y);
    if (dist < nearestDist) {
      nearestPort = port;
      nearestDist = dist;
    }
  }
  return nearestPort;
}

export const handlePortPointerDown = (
  e0: React.PointerEvent<HTMLDivElement>,
  portKey: string,
) => {
  actions.setDraggingPortKey(portKey);

  const { portStuffs } = store.state;
  const targetPortStuffs = Object.values(portStuffs).filter(
    (ps) => ps.portKey === portKey || isPortConnectable(portKey, ps.portKey),
  );

  // const selfPortStuff = portStuffs[portKey];
  // const originalPosition = selfPortStuff.position;

  startDragSession(e0.nativeEvent, {
    onMove(e) {
      const pos = { x: e.position.x, y: e.position.y };
      // const delta = {
      //   x: e.position.x - originalPosition.x,
      //   y: e.position.y - originalPosition.y,
      // };
      // const pos = {
      //   x: originalPosition.x + delta.x,
      //   y: originalPosition.y + delta.y,
      // };
      const nearestPort = findNearestPort(targetPortStuffs, pos);
      if (nearestPort) {
        actions.setPreviewDestPortKey(nearestPort.portKey);
      }
    },
    onUpOrCancel(e) {
      actions.setDraggingPortKey(null);
      actions.setPreviewDestPortKey(null);
    },
  });
};
