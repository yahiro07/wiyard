import { Point } from "@/domain/common-types";

export const vectorOp = {
  add(v0: Point, v1: Point) {
    return { x: v0.x + v1.x, y: v0.y + v1.y };
  },
  subtract(v0: Point, v1: Point) {
    return { x: v0.x - v1.x, y: v0.y - v1.y };
  },
  distance(v0: Point, v1: Point) {
    return Math.hypot(v0.x - v1.x, v0.y - v1.y);
  },
};

export const domRectOp = {
  getCenter(rect: DOMRect) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  },
};
