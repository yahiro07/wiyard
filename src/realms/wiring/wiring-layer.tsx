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
  const p0 = sourcePort.position;
  const p1 = destPort.position;
  return (
    <line
      x1={p0.x}
      y1={p0.y}
      x2={p1.x}
      y2={p1.y}
      stroke="gray"
      strokeWidth="4"
    />
  );
};

export const WiringLayer = () => {
  const { wireConnectionKeys, portStuffs } = store.useSnapshot();
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const viewBox = `0 0 ${winW} ${winH}`;
  return (
    <div className="absolute-full overflow-hidden pointer-events-none">
      <svg className="bd-red" viewBox={viewBox}>
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
