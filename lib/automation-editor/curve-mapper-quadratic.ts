import { seqNumbers } from "@lib/utils/number-helper";
import { vectorOp } from "@lib/utils/geometry-helper";
import { Point } from "@lib/utils/common-types";
import { CurveSegment, KnotPoint } from "./types";

const quadraticCurveHelper = {
  buildSegmentsInnerFit(points: Point[]): CurveSegment[] {
    if (points.length < 2) {
      return [];
    }
    if (points.length === 2) {
      return [{ type: "line", points: [points[0], points[1]] }];
    }
    return seqNumbers(points.length).map((i) => {
      if (i === 0) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const mp = vectorOp.middle(p0, p1);
        return { type: "line", points: [p0, mp] };
      } else if (i === points.length - 1) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const mp = vectorOp.middle(p0, p1);
        return { type: "line", points: [mp, p1] };
      } else {
        const p0 = points[i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const mp01 = vectorOp.middle(p0, p1);
        const mp02 = vectorOp.middle(p1, p2);
        return { type: "quadratic", points: [mp01, p1, mp02] };
      }
    });
  },
  fixPointsForOuterFit(points: Point[]): Point[] {
    return points.map((po, i) => {
      if (i === 0 || i === points.length - 1) {
        return po;
      }
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const mp01 = vectorOp.middle(p0, p1);
      const mp02 = vectorOp.middle(p1, p2);
      const foot = vectorOp.middle(mp01, mp02);
      const ev = vectorOp.subtract(p1, foot);
      return vectorOp.add(p1, vectorOp.scale(ev, 0.5));
    });
  },
};

function splitStrokePointsToCurveGroups(points: KnotPoint[]): KnotPoint[][] {
  const headIndices = points
    .map((po, i) =>
      i === 0 || (!po.curved && i !== points.length - 1) ? i : undefined,
    )
    .filter((i) => i !== undefined);
  const groups = headIndices.map((idx, k) => {
    const idx2 = headIndices[k + 1] ?? points.length;
    return points.slice(idx, idx2 + 1);
  });
  return groups;
}

export function curveMapperQuadratic_buildSegments(
  points: KnotPoint[],
  mode: "innerFit" | "outerFit",
): CurveSegment[] {
  const curveGroups = splitStrokePointsToCurveGroups(points);
  if (mode === "innerFit") {
    return curveGroups.flatMap(quadraticCurveHelper.buildSegmentsInnerFit);
  } else {
    return curveGroups.flatMap((points) => {
      const fixedPoints = quadraticCurveHelper.fixPointsForOuterFit(points);
      return quadraticCurveHelper.buildSegmentsInnerFit(fixedPoints);
    });
  }
}
