import { useMemo } from "react";
import { wireColors } from "@/domain/constants";
import { PortStuff } from "@/domain/types";
import { store } from "@/store/store";

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
  return (
    <line
      x1={p0.x}
      y1={p0.y}
      x2={p1.x}
      y2={p1.y}
      stroke={color}
      strokeWidth="4"
    />
  );
};

export const WiringLayer = () => {
  const { wireConnectionKeys, portStuffs } = store.useSnapshot();
  const [winW, winH] = useMemo(
    () => [window.innerWidth, window.innerHeight],
    [],
  );
  const viewBox = `0 0 ${winW} ${winH}`;
  return (
    <div className="absolute-full overflow-hidden pointer-events-none">
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
