import { Point } from "@lib/utils/common-types";

export type KnotPoint = {
  x: number;
  y: number;
  curved: boolean;
};

export type CurveSegment =
  | { type: "line"; points: [Point, Point] }
  | { type: "curve"; points: [Point, Point, Point, Point] }
  | { type: "quadratic"; points: [Point, Point, Point] };
