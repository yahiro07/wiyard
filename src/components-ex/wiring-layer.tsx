import { Point, Size } from "beams/ax-ui/common-types";

export type WiringLayerWire = {
  id: string;
  p1: Point;
  p2: Point;
};
type Props = {
  boardSize: Size;
  wires: WiringLayerWire[];
};

export const WiringLayer = ({ boardSize, wires }: Props) => {
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width={boardSize.width}
      height={boardSize.height}
    >
      {wires.map((wire) => (
        <line
          key={wire.id}
          x1={wire.p1.x}
          y1={wire.p1.y}
          x2={wire.p2.x}
          y2={wire.p2.y}
          stroke="#888"
          strokeWidth={10}
        />
      ))}
    </svg>
  );
};
