import { clampValue } from "@lib/utils/number-helper";
import { Point } from "@lib/utils/common-types";
import {
  curveMapperQuadratic_ensureEndPoints,
  innerFitSegmentAtPointIndex,
  isGroupHead,
} from "./curve-mapper-quadratic";
import { CurveSegment, KnotPoint } from "./types";

function innerFitSegmentCoveringPos(
  group: KnotPoint[],
  intervalIndex: number,
  pos: number,
): CurveSegment {
  if (group.length === 2) {
    return { type: "line", points: [group[0], group[1]] };
  }
  const p0 = group[intervalIndex];
  const p1 = group[intervalIndex + 1];
  const midX = (p0.x + p1.x) / 2;
  if (intervalIndex === 0 && pos <= midX) {
    return innerFitSegmentAtPointIndex(group, 0);
  }
  if (intervalIndex === group.length - 2 && pos > midX) {
    return innerFitSegmentAtPointIndex(group, group.length - 1);
  }
  const knotIndex = pos <= midX ? intervalIndex : intervalIndex + 1;
  return innerFitSegmentAtPointIndex(group, knotIndex);
}

function getSegmentAt(
  points: KnotPoint[],
  pos: number,
): CurveSegment | undefined {
  if (points.length < 2) return undefined;

  let intervalIndex = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (pos < points[i + 1].x) {
      intervalIndex = i;
      break;
    }
    intervalIndex = i;
  }

  let groupStart = 0;
  for (let i = 0; i <= intervalIndex; i++) {
    if (isGroupHead(points, i)) groupStart = i;
  }
  let groupEnd = points.length;
  for (let i = groupStart + 1; i < points.length; i++) {
    if (isGroupHead(points, i)) {
      groupEnd = i + 1;
      break;
    }
  }
  const group = points.slice(groupStart, groupEnd);
  const localInterval = intervalIndex - groupStart;
  return innerFitSegmentCoveringPos(group, localInterval, pos);
}

function lerpY(a: Point, b: Point, pos: number): number {
  const dx = b.x - a.x;
  if (dx === 0) return a.y;
  const t = clampValue((pos - a.x) / dx, 0, 1);
  return a.y + (b.y - a.y) * t;
}

function bezier2(p0: number, p1: number, p2: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

function quadraticYAtX(p0: Point, p1: Point, p2: Point, pos: number): number {
  const a = p0.x - 2 * p1.x + p2.x;
  const b = 2 * (p1.x - p0.x);
  const c = p0.x - pos;
  let t: number;
  if (Math.abs(a) < 1e-8) {
    t = Math.abs(b) < 1e-8 ? 0 : -c / b;
  } else {
    const disc = b * b - 4 * a * c;
    if (disc < 0) {
      t = clampValue(-c / (2 * a), 0, 1);
    } else {
      const sqrtDisc = Math.sqrt(disc);
      const t0 = (-b + sqrtDisc) / (2 * a);
      const t1 = (-b - sqrtDisc) / (2 * a);
      const inRange0 = t0 >= 0 && t0 <= 1;
      const inRange1 = t1 >= 0 && t1 <= 1;
      if (inRange0 && !inRange1) t = t0;
      else if (inRange1 && !inRange0) t = t1;
      else if (inRange0 && inRange1)
        t = Math.abs(t0 - 0.5) < Math.abs(t1 - 0.5) ? t0 : t1;
      else
        t = clampValue(Math.abs(t0 - 0.5) < Math.abs(t1 - 0.5) ? t0 : t1, 0, 1);
    }
  }
  t = clampValue(t, 0, 1);
  return bezier2(p0.y, p1.y, p2.y, t);
}

export function curveMapperQuadraticPointSampleB_getCurveValueAt(
  points: KnotPoint[],
  pos: number,
): number {
  if (points.length === 0) return 0;
  const padded = curveMapperQuadratic_ensureEndPoints(points);
  if (padded.length === 1) return padded[0].y;
  const segment = getSegmentAt(padded, pos);
  if (!segment) return padded[0].y;
  if (segment.type === "line") {
    const [a, b] = segment.points;
    return lerpY(a, b, pos);
  }
  if (segment.type === "quadratic") {
    const [p0, p1, p2] = segment.points;
    return quadraticYAtX(p0, p1, p2, pos);
  }
  const [a, , , b] = segment.points;
  return lerpY(a, b, pos);
}
