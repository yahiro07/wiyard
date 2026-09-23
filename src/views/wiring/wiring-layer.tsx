import { Point } from "@lib/utils/common-types";
import { HsPortSubtype } from "wafer-host/core";
import { uiConstants, wireColors } from "@/common/theme";
import {
  getForwardDirectionWireConnectionKey,
  getPortDirectionFromPortKey,
  splitConnectionKey,
} from "@/domain/port-helpers";
import { store } from "@/store/store";
import { resultOf } from "@lib/utils/general-helper";
import { renderLog } from "@lib/utils/render-log";

function createCurveLinePath(p0: Point, p1: Point) {
  // const handleLength = Math.max(48, Math.abs(p1.x - p0.x) / 2);
  const handleLength = Math.abs(p1.x - p0.x) / 2;
  const cp0 = { x: p0.x + handleLength, y: p0.y };
  const cp1 = { x: p1.x - handleLength, y: p1.y };
  return [
    `M ${p0.x} ${p0.y}`,
    `C ${cp0.x} ${cp0.y}`,
    `${cp1.x} ${cp1.y}`,
    `${p1.x} ${p1.y}`,
  ].join(" ");
}

const WireView = ({
  signalType,
  p0,
  p1,
  weaken,
}: {
  signalType: HsPortSubtype;
  p0: Point;
  p1: Point;
  weaken?: boolean;
}) => {
  const color = wireColors[signalType];
  const path = createCurveLinePath(p0, p1);
  return (
    <path
      d={path}
      stroke={color}
      strokeWidth="3"
      fill="none"
      opacity={weaken ? uiConstants.dimmedWireOpacity : 1}
    />
  );
};

const Wire = ({
  wireConnectionKey,
  weaken,
}: {
  wireConnectionKey: string;
  weaken?: boolean;
}) => {
  const { portStuffs } = store.useSnapshot();
  const [sourcePortKey, destinationPortKey] =
    splitConnectionKey(wireConnectionKey);
  const sourcePort = portStuffs[sourcePortKey];
  const destPort = portStuffs[destinationPortKey];

  if (!(sourcePort && destPort)) return null;

  renderLog("Wire", wireConnectionKey);

  const signalType = sourcePort.subtype;
  const p0 = sourcePort.position;
  const p1 = destPort.position;
  return <WireView signalType={signalType} p0={p0} p1={p1} weaken={weaken} />;
};

const WiresRoot = () => {
  const { wireConnectionKeys, draggingPortKey, previewDestPortKey } =
    store.useSnapshot();
  const isDragging = draggingPortKey !== null;

  const previewRemovingConnectionKey = resultOf(() => {
    if (draggingPortKey && previewDestPortKey) {
      return getForwardDirectionWireConnectionKey(
        draggingPortKey,
        previewDestPortKey,
      );
    }
  });
  return (
    <g>
      {wireConnectionKeys.map((wireConnectionKey) => {
        if (wireConnectionKey === previewRemovingConnectionKey) return null;
        return (
          <Wire
            key={wireConnectionKey}
            wireConnectionKey={wireConnectionKey}
            weaken={isDragging}
          />
        );
      })}
    </g>
  );
};

const DragPreviewWire = () => {
  //port to port preview wire
  const { draggingPortKey, previewDestPortKey, wireConnectionKeys } =
    store.useSnapshot();
  if (
    !(
      draggingPortKey &&
      previewDestPortKey &&
      draggingPortKey !== previewDestPortKey
    )
  ) {
    return;
  }
  const connectionKey = getForwardDirectionWireConnectionKey(
    draggingPortKey,
    previewDestPortKey,
  );

  if (wireConnectionKeys.includes(connectionKey)) {
    //existing wire, show nothing for removing preview
    return;
  }
  return <Wire wireConnectionKey={connectionKey} />;
};

const DragPreviewWire2 = () => {
  //port to arbitrary position preview wire
  const { draggingPortKey, previewDestPosition, portStuffs } =
    store.useSnapshot();
  if (!(draggingPortKey && previewDestPosition)) return;
  const srcPort = portStuffs[draggingPortKey];
  const isForwardDirection =
    getPortDirectionFromPortKey(draggingPortKey) === "output";
  const [p0, p1] = isForwardDirection
    ? [srcPort.position, previewDestPosition]
    : [previewDestPosition, srcPort.position];
  return <WireView signalType={srcPort.subtype} p0={p0} p1={p1} />;
};

export const WiringLayer = () => {
  const { boardSize } = store.useSnapshot();
  const { width: w, height: h } = boardSize;
  const viewBox = `${-w / 2} ${-h / 2} ${w} ${h}`;
  return (
    <svg
      className="absolute pointer-events-none"
      viewBox={viewBox}
      style={{
        left: -w / 2,
        top: -h / 2,
        width: w,
        height: h,
      }}
    >
      <WiresRoot />
      <DragPreviewWire />
      <DragPreviewWire2 />
    </svg>
  );
};
