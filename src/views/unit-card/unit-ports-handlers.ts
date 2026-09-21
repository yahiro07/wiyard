import { Point } from "@lib/utils/common-types";
import { createDragSessionEx } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { getGraphEditPlaneElement } from "@/common/constants";
import { uiConfigs } from "@/common/theme";
import { isPortConnectable, splitConnectionKey } from "@/domain/port-helpers";
import { PortStuff } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

const helpers = {
  findNearestPort(portStuffsArray: PortStuff[], pos: Point) {
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
  },
  getConnectedWires(portKey: string) {
    const { wireConnectionKeys } = store.state;
    return wireConnectionKeys.filter((key) => key.includes(portKey));
  },
  getAltSidePortKey(connectionKey: string, portKey: string) {
    const portKeys = splitConnectionKey(connectionKey);
    return portKeys.find((key) => key !== portKey);
  },
};

const internalHandlers = {
  handlePortTap(portKey: string) {
    const connectedWires = helpers.getConnectedWires(portKey);
    if (connectedWires.length === 0) {
      const { portStuffs } = store.state;
      const selfPort = portStuffs[portKey];
      if (!selfPort) return;
      const targetPorts = Object.values(portStuffs).filter(
        (ps) =>
          isPortConnectable(portKey, ps.portKey) &&
          ((selfPort.direction === "output" &&
            ps.position.x > selfPort.position.x) ||
            (selfPort.direction === "input" &&
              ps.position.x < selfPort.position.x)),
      );
      const nearestPort = helpers.findNearestPort(
        targetPorts,
        selfPort.position,
      );
      if (nearestPort) {
        actions.toggleWire(portKey, nearestPort.portKey);
      }
    } else if (connectedWires.length === 1) {
      const targetPortKey = helpers.getAltSidePortKey(
        connectedWires[0],
        portKey,
      );
      if (targetPortKey) {
        actions.toggleWire(portKey, targetPortKey);
      }
    }
  },
};

export const handlePortPointerDown = (
  e0: React.PointerEvent<HTMLDivElement>,
  portKey: string,
) => {
  const coordinateBaseElement = getGraphEditPlaneElement();
  const { portStuffs } = store.state;
  const selfPort = portStuffs[portKey];
  const targetPorts = Object.values(portStuffs).filter(
    (ps) => ps.portKey === portKey || isPortConnectable(portKey, ps.portKey),
  );

  createDragSessionEx(e0, { coordinateBaseElement }).run({
    onStart() {
      actions.setDraggingPortKey(portKey);
    },
    onMove(pos: Point) {
      const nearestPort = helpers.findNearestPort(targetPorts, pos);
      if (uiConfigs.showWireConnectionPreviewFloatingWireEnd) {
        if (nearestPort && nearestPort !== selfPort) {
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
    onUp() {
      const { draggingPortKey, previewDestPortKey } = store.state;
      if (draggingPortKey && previewDestPortKey) {
        actions.toggleWire(draggingPortKey, previewDestPortKey, true);
      }
    },
    onTap() {
      internalHandlers.handlePortTap(portKey);
    },
    onEnd() {
      actions.setDraggingPortKey(null);
      actions.setPreviewDestPortKey(null);
      actions.setPreviewDestPosition(null);
    },
  });
};
