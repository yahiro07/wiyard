import { Point } from "@/domain/common-types";

export const vectorOp = {
  equals(v0: Point, v1: Point) {
    return v0.x === v1.x && v0.y === v1.y;
  },
  add(v0: Point, v1: Point) {
    return { x: v0.x + v1.x, y: v0.y + v1.y };
  },
  subtract(v0: Point, v1: Point) {
    return { x: v0.x - v1.x, y: v0.y - v1.y };
  },
  distance(v0: Point, v1: Point) {
    return Math.hypot(v0.x - v1.x, v0.y - v1.y);
  },
  snapped(v: Point, gridPitch: number) {
    return {
      x: Math.round(v.x / gridPitch) * gridPitch,
      y: Math.round(v.y / gridPitch) * gridPitch,
    };
  },
  scale(v: Point, m: number) {
    return { x: v.x * m, y: v.y * m };
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
