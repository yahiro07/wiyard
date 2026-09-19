import { Point } from "@lib/utils/common-types";

export type KnotPoint = {
  x: number;
  y: number;
  curved: boolean;
};

export type CurveSegment =
  | { type: "line"; points: [Point, Point] }
  | { type: "bezier"; points: [Point, Point, Point, Point] }
  | { type: "quadratic"; points: [Point, Point, Point] };

export type LoopBars = 0.25 | 0.5 | 1 | 2 | 4 | 8 | 16 | 32 | 64;
