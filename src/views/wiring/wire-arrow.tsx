import { wireColors } from "@/common/appearance";
import { Icons } from "@/common/icons";
import { splitConnectionKey } from "@/domain/port-helpers";
import { store } from "@/store/store";
import { Point } from "@lib/utils/common-types";
import { vectorOp } from "@lib/utils/geometry-helper";
import { HsPortSubtype } from "wafer-host/core";

const WireArrowView = ({
  signalType,
  mp,
  angle,
  weaken,
}: {
  signalType: HsPortSubtype;
  mp: Point;
  angle: number;
  weaken?: boolean;
}) => {
  const color = wireColors[signalType];
  return (
    <div
      className=""
      style={{
        position: "absolute",
        left: mp.x,
        top: mp.y,
        transform: ` translate(-50%, -50%) rotate(${angle}deg)`,
        color,
        opacity: weaken ? wireColors.dimmedWireOpacity : 1,
      }}
    >
      <Icons.Play size={20} />
    </div>
  );
};

export const WireArrow = ({ connectionKey }: { connectionKey: string }) => {
  const { portStuffs, draggingPortKey } = store.useSnapshot();
  const [sourcePortKey, destinationPortKey] = splitConnectionKey(connectionKey);
  const sourcePort = portStuffs[sourcePortKey];
  const destPort = portStuffs[destinationPortKey];
  if (!(sourcePort && destPort)) return null;

  const p0 = sourcePort.position;
  const p1 = destPort.position;
  const isDragging = draggingPortKey !== null;
  const weaken = isDragging;

  const mp = vectorOp.middle(p0, p1);
  const angle = vectorOp.angleDeg(vectorOp.subtract(p1, p0));
  return (
    <WireArrowView
      signalType={sourcePort.subtype}
      mp={mp}
      angle={angle}
      weaken={weaken}
    />
  );
};
