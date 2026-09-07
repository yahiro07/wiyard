import { uiConfigs } from "@/common/theme";
import { isPortConnectable } from "@/domain/port-helpers";
import { PortStuff } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { Point, startDragSession } from "@/utils/drag-session";
import { vectorOp } from "@/utils/geometry-helper";

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
    const portKeys = connectionKey.split("-");
    return portKeys.find((key) => key !== portKey);
  },
};

const internalHandlers = {
  handlePortTap(portKey: string) {
    const connectedWires = helpers.getConnectedWires(portKey);
    if (connectedWires.length === 0) {
      const { portStuffs } = store.state;
      const selfPort = portStuffs[portKey];
      const targetPorts = Object.values(portStuffs).filter(
        (ps) =>
          (isPortConnectable(portKey, ps.portKey) &&
            selfPort.direction === "output" &&
            ps.position.x > selfPort.position.x) ||
          (selfPort.direction === "input" &&
            ps.position.x < selfPort.position.x),
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

function createDragHandlerCore(portKey: string) {
  const { portStuffs } = store.state;
  const targetPorts = Object.values(portStuffs).filter(
    (ps) => ps.portKey === portKey || isPortConnectable(portKey, ps.portKey),
  );
  const selfPort = portStuffs[portKey];

  return {
    onStart() {
      actions.setDraggingPortKey(portKey);
    },
    onMove(pos: Point) {
      const nearestPort = helpers.findNearestPort(targetPorts, pos);
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
    onEnd() {
      const { draggingPortKey, previewDestPortKey } = store.state;
      if (draggingPortKey && previewDestPortKey) {
        actions.toggleWire(draggingPortKey, previewDestPortKey);
      }
      actions.setDraggingPortKey(null);
      actions.setPreviewDestPortKey(null);
      actions.setPreviewDestPosition(null);
    },
    onTap() {
      internalHandlers.handlePortTap(portKey);
    },
  };
}

export const handlePortPointerDown = (
  e0: React.PointerEvent<HTMLDivElement>,
  portKey: string,
) => {
  const { portStuffs } = store.state;
  const selfPort = portStuffs[portKey];
  const core = createDragHandlerCore(portKey);
  const tapDurationTh = 200;
  const tapDistanceTh = 10;

  let timerId: NodeJS.Timeout | undefined;
  let started = false;

  const internal = {
    triggerStart() {
      if (!started) {
        core.onStart();
        started = true;
      }
    },
    cancelTimer() {
      if (timerId) {
        clearTimeout(timerId);
        timerId = undefined;
      }
    },
  };
  timerId = setTimeout(internal.triggerStart, tapDurationTh);

  startDragSession(
    e0.nativeEvent,
    {
      onMove(e) {
        const delta = vectorOp.subtract(e.position, e.originalPosition);
        const pos = vectorOp.add(selfPort.position, delta);
        const distance = vectorOp.distance(pos, selfPort.position);
        if (!started && distance > tapDistanceTh) {
          internal.triggerStart();
          internal.cancelTimer();
        }
        if (started) {
          core.onMove(pos);
        }
      },
      onUpOrCancel() {
        core.onEnd();
        internal.cancelTimer();
      },
      onTap() {
        core.onTap();
        internal.cancelTimer();
      },
    },
    { tapDurationTh, tapDistanceTh },
  );
};
