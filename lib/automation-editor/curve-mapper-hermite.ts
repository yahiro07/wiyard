import { Point } from "@lib/utils/common-types";
import { CurveSegment, KnotPoint } from "./types";

export function curveMapperHermite_buildSegments(
  points: KnotPoint[],
): CurveSegment[] {
  if (points.length < 2) return [];

  const slope = (a: Point, b: Point) => {
    const dx = b.x - a.x;
    return dx === 0 ? 0 : (b.y - a.y) / dx;
  };
  const outgoingSlope = (i: number) => {
    const a = points[i];
    const b = points[i + 1];
    if (!b) return 0;
    if (!a.curved) return slope(a, b);
    const prev = points[i - 1];
    return prev ? slope(prev, b) : slope(a, b);
  };
  const incomingSlope = (i: number) => {
    const b = points[i];
    const a = points[i - 1];
    if (!a) return 0;
    if (!b.curved) return slope(a, b);
    const next = points[i + 1];
    return next ? slope(a, next) : slope(a, b);
  };

  const segments: CurveSegment[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a.curved && !b.curved) {
      segments.push({ type: "line", points: [a, b] });
      continue;
    }
    const dx = b.x - a.x;
    const m0 = outgoingSlope(i - 1);
    const m1 = incomingSlope(i);
    segments.push({
      type: "curve",
      points: [
        a,
        { x: a.x + dx / 3, y: a.y + (m0 * dx) / 3 },
        { x: b.x - dx / 3, y: b.y - (m1 * dx) / 3 },
        b,
      ],
    });
  }
  return segments;
}
