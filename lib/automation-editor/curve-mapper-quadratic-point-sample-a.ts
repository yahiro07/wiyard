import { clampValue } from "@lib/utils/number-helper";
import { Point } from "@lib/utils/common-types";
import { CurveSegment, KnotPoint } from "./types";
import { curveMapperQuadratic_buildSegments } from "./curve-mapper-quadratic";

const helpers = {
  segmentXEnd(segment: CurveSegment): number {
    if (segment.type === "line") return segment.points[1].x;
    if (segment.type === "quadratic") return segment.points[2].x;
    return segment.points[3].x;
  },
  evalLine(p0: Point, p1: Point, x: number): number {
    const dx = p1.x - p0.x;
    if (dx === 0) return p0.y;
    const t = clampValue((x - p0.x) / dx, 0, 1);
    return p0.y + (p1.y - p0.y) * t;
  },
  evalQuadratic(p0: Point, p1: Point, p2: Point, x: number): number {
    const t = helpers.solveQuadraticBezierT(p0.x, p1.x, p2.x, x);
    const u = 1 - t;
    return u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
  },
  evalSegment(segment: CurveSegment, x: number): number {
    if (segment.type === "line") {
      return helpers.evalLine(segment.points[0], segment.points[1], x);
    }
    if (segment.type === "quadratic") {
      return helpers.evalQuadratic(
        segment.points[0],
        segment.points[1],
        segment.points[2],
        x,
      );
    }
    return segment.points[3].y;
  },
  solveQuadraticBezierT(x0: number, x1: number, x2: number, x: number): number {
    const a = x0 - 2 * x1 + x2;
    const b = 2 * (x1 - x0);
    const c = x0 - x;
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) return 0;
      return clampValue(-c / b, 0, 1);
    }
    const disc = b * b - 4 * a * c;
    if (disc < 0) {
      return Math.abs(x - x0) < Math.abs(x - x2) ? 0 : 1;
    }
    const sqrtD = Math.sqrt(disc);
    const candidates = [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
    const inRange = candidates.find((t) => t >= -1e-6 && t <= 1 + 1e-6);
    return clampValue(inRange ?? candidates[0], 0, 1);
  },
};

export function curveMapperQuadraticPointSampleA_getCurveValueAt(
  points: KnotPoint[],
  pos: number,
): number {
  if (points.length === 0) return 0;
  const x = clampValue(pos, 0, 1);
  const first = points[0];
  const last = points[points.length - 1];
  if (points.length === 1 || x <= first.x) return first.y;
  if (x >= last.x) return last.y;

  const segments = curveMapperQuadratic_buildSegments(points);
  const segment =
    segments.find((seg) => x <= helpers.segmentXEnd(seg)) ?? segments.at(-1);
  if (!segment) return first.y;
  return helpers.evalSegment(segment, x);
}
