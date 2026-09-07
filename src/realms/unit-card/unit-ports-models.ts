import { uiConfigs } from "@/common/theme";
import { isPortConnectable } from "@/domain/port-helpers";
import { PortStuff } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { Point, startDragSession } from "@/utils/drag-session";
import { vectorOp } from "@/utils/geometry-helper";

export function findNearestPort(portStuffsArray: PortStuff[], pos: Point) {
  let nearestPort: PortStuff | null = null;
  let nearestDist = Infinity;
  for (const port of portStuffsArray) {
    const dist = vectorOp.distance(port.position, pos);
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
  const selfPort = portStuffs[portKey];

  startDragSession(e0.nativeEvent, {
    onMove(e) {
      const delta = vectorOp.subtract(e.position, e.originalPosition);
      const pos = vectorOp.add(selfPort.position, delta);
      const nearestPort = findNearestPort(targetPortStuffs, pos);
      if (uiConfigs.showWireConnectionPreviewFloatingWireEnd) {
        if (nearestPort && nearestPort !== selfPort) {
          // actions.setPreviewDestPosition(nearestPort.position);
          actions.setPreviewDestPortKey(nearestPort.portKey);
          actions.setPreviewDestPosition(null);
        } else if (nearestPort === selfPort) {
          actions.setPreviewDestPortKey(null);
          actions.setPreviewDestPosition(pos);
        }
      } else {
        if (nearestPort && nearestPort !== selfPort) {
          actions.setPreviewDestPortKey(nearestPort.portKey);
        } else {
          actions.setPreviewDestPortKey(null);
        }
      }
    },
    onUpOrCancel(e) {
      const { draggingPortKey, previewDestPortKey } = store.state;
      if (draggingPortKey && previewDestPortKey) {
        actions.toggleWire(draggingPortKey, previewDestPortKey);
      }
      actions.setDraggingPortKey(null);
      actions.setPreviewDestPortKey(null);
      actions.setPreviewDestPosition(null);
    },
  });
};
