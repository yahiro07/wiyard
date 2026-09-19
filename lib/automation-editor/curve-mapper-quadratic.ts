import { seqNumbers } from "@lib/utils/number-helper";
import { vectorOp } from "@lib/utils/geometry-helper";
import { Point } from "@lib/utils/common-types";
import { CurveSegment, KnotPoint } from "./types";

export function curveMapperQuadratic_ensureEndPoints(
  points: KnotPoint[],
): KnotPoint[] {
  const firstP = points.at(0);
  const lastP = points.at(-1);
  if (!firstP || !lastP) return points;
  const alreadyPadded = lastP !== firstP && firstP.x < 0.01 && lastP.x > 0.99;
  if (alreadyPadded) return points;

  const newPoints = [...points];
  if (firstP.x > 0.01) {
    newPoints.unshift({ x: 0, y: firstP.y, curved: false });
  }
  if (lastP.x < 0.99) {
    newPoints.push({ x: 1, y: lastP.y, curved: false });
  }
  return newPoints;
}

export function isGroupHead(points: KnotPoint[], i: number): boolean {
  return i === 0 || (!points[i].curved && i !== points.length - 1);
}

export function splitStrokePointsToCurveGroups(
  points: KnotPoint[],
): KnotPoint[][] {
  const headIndices = points
    .map((po, i) => (isGroupHead(points, i) ? i : undefined))
    .filter((i) => i !== undefined);
  const groups = headIndices.map((idx, k) => {
    const idx2 = headIndices[k + 1] ?? points.length;
    return points.slice(idx, idx2 + 1);
  });
  return groups;
}

export function innerFitSegmentAtPointIndex(
  points: Point[],
  i: number,
): CurveSegment {
  if (i === 0) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mp = vectorOp.middle(p0, p1);
    return { type: "line", points: [p0, mp] };
  }
  if (i === points.length - 1) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const mp = vectorOp.middle(p0, p1);
    return { type: "line", points: [mp, p1] };
  }
  const p0 = points[i - 1];
  const p1 = points[i];
  const p2 = points[i + 1];
  const mp01 = vectorOp.middle(p0, p1);
  const mp02 = vectorOp.middle(p1, p2);
  return { type: "quadratic", points: [mp01, p1, mp02] };
}

const quadraticCurveHelper = {
  buildSegmentsInnerFit(points: Point[]): CurveSegment[] {
    if (points.length < 2) {
      return [];
    }
    if (points.length === 2) {
      return [{ type: "line", points: [points[0], points[1]] }];
    }
    return seqNumbers(points.length).map((i) =>
      innerFitSegmentAtPointIndex(points, i),
    );
  },
};

export function curveMapperQuadratic_buildSegments(
  points: KnotPoint[],
): CurveSegment[] {
  const curveGroups = splitStrokePointsToCurveGroups(points);
  return curveGroups.flatMap(quadraticCurveHelper.buildSegmentsInnerFit);
}
