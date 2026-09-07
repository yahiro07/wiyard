import { useMemo } from "react";
import { HsPortSubtype } from "wafer-host/core";
import { wireColors } from "@/common/theme";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";
import { Point } from "@/utils/drag-session";

function createCurveLinePath(p0: Point, p1: Point) {
  const handleLength = Math.max(48, Math.abs(p1.x - p0.x) / 2);
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
      opacity={weaken ? 0.2 : 1}
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
  const [sourcePortKey, destinationPortKey] = wireConnectionKey.split("-");
  const sourcePort = portStuffs[sourcePortKey];
  const destPort = portStuffs[destinationPortKey];
  if (!(sourcePort && destPort)) return null;
  const signalType = sourcePort.subtype;
  const p0 = sourcePort.position;
  const p1 = destPort.position;
  return <WireView signalType={signalType} p0={p0} p1={p1} weaken={weaken} />;
};

const WiresRoot = () => {
  const { wireConnectionKeys, draggingPortKey } = store.useSnapshot();
  const isDragging = draggingPortKey !== null;
  return (
    <g>
      {wireConnectionKeys.map((wireConnectionKey) => (
        <Wire
          key={wireConnectionKey}
          wireConnectionKey={wireConnectionKey}
          weaken={isDragging}
        />
      ))}
    </g>
  );
};

const DragPreviewWire = () => {
  //port to port preview wire
  const { draggingPortKey, previewDestPortKey } = store.useSnapshot();
  if (
    !(
      draggingPortKey &&
      previewDestPortKey &&
      draggingPortKey !== previewDestPortKey
    )
  ) {
    return;
  }
  const connectionKey = `${draggingPortKey}-${previewDestPortKey}`;
  return <Wire wireConnectionKey={connectionKey} />;
};

const DragPreviewWire2 = () => {
  //port to arbitrary position preview wire
  const { draggingPortKey, previewDestPosition, portStuffs } =
    store.useSnapshot();
  if (!(draggingPortKey && previewDestPosition)) return;
  const srcPort = portStuffs[draggingPortKey];
  return (
    <WireView
      signalType={srcPort.subtype}
      p0={srcPort.position}
      p1={previewDestPosition}
    />
  );
};

export const WiringLayer = () => {
  const [winW, winH] = useMemo(
    () => [window.innerWidth, window.innerHeight],
    [],
  );
  const viewBox = `0 0 ${winW} ${winH}`;
  return (
    <div className={cz("absolute-full overflow-hidden pointer-events-none")}>
      <svg viewBox={viewBox} style={{ width: winW, height: winH }}>
        <WiresRoot />
        <DragPreviewWire />
        <DragPreviewWire2 />
      </svg>
    </div>
  );
};
