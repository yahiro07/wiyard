import { useMemo } from "react";
import { wireColors } from "@/common/theme";
import { PortStuff } from "@/domain/types";
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

const Wire = ({
  wireConnectionKey,
  portStuffs,
}: {
  wireConnectionKey: string;
  portStuffs: Record<string, PortStuff>;
}) => {
  const [sourcePortKey, destinationPortKey] = wireConnectionKey.split("-");
  const sourcePort = portStuffs[sourcePortKey];
  const destPort = portStuffs[destinationPortKey];
  if (!(sourcePort && destPort)) return null;
  const signalType = sourcePort.subtype;
  const p0 = sourcePort.position;
  const p1 = destPort.position;
  const color = wireColors[signalType];
  const path = createCurveLinePath(p0, p1);
  return <path d={path} stroke={color} strokeWidth="3" fill="none" />;
};

export const WiringLayer = () => {
  const { wireConnectionKeys, portStuffs, draggingPortKey } =
    store.useSnapshot();
  const isDragging = draggingPortKey !== null;
  const [winW, winH] = useMemo(
    () => [window.innerWidth, window.innerHeight],
    [],
  );
  const viewBox = `0 0 ${winW} ${winH}`;
  return (
    <div
      className={cz(
        "absolute-full overflow-hidden pointer-events-none",
        isDragging && "opacity-20",
      )}
    >
      <svg viewBox={viewBox} style={{ width: winW, height: winH }}>
        {wireConnectionKeys.map((wireConnectionKey) => (
          <Wire
            key={wireConnectionKey}
            wireConnectionKey={wireConnectionKey}
            portStuffs={portStuffs}
          />
        ))}
      </svg>
    </div>
  );
};
