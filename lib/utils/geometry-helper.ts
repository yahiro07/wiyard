import { inBetween } from "@lib/utils/number-helper";
import { Point, Rect, Size, Vector } from "./common-types";

export const vectorOp = {
  equals(a: Vector, b: Vector) {
    return a.x === b.x && a.y === b.y;
  },
  add(a: Vector, b: Vector) {
    return { x: a.x + b.x, y: a.y + b.y };
  },
  subtract(a: Vector, b: Vector) {
    return { x: a.x - b.x, y: a.y - b.y };
  },
  distance(a: Vector, b: Vector) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  },
  snapped(v: Vector, gridPitch: number) {
    return {
      x: Math.round(v.x / gridPitch) * gridPitch,
      y: Math.round(v.y / gridPitch) * gridPitch,
    };
  },
  scale(v: Vector, m: number) {
    return { x: v.x * m, y: v.y * m };
  },
  middle(a: Vector, b: Vector) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  },
};

export const sizeOp = {
  scale(size: Size, m: number) {
    return { width: size.width * m, height: size.height * m };
  },
  rounded(size: Size) {
    return { width: Math.round(size.width), height: Math.round(size.height) };
  },
};

export const rectOp = {
  center(rect: Rect) {
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  },
  corner(rect: Rect, corner: "tl" | "tr" | "bl" | "br"): Point {
    if (corner === "tl") return { x: rect.x, y: rect.y };
    if (corner === "tr") return { x: rect.x + rect.width, y: rect.y };
    if (corner === "bl") return { x: rect.x, y: rect.y + rect.height };
    if (corner === "br")
      return { x: rect.x + rect.width, y: rect.y + rect.height };
    return { x: rect.x, y: rect.y };
  },
  containsRect(outer: Rect, inner: Rect) {
    return (
      inner.x >= outer.x &&
      inner.y >= outer.y &&
      inner.x + inner.width <= outer.x + outer.width &&
      inner.y + inner.height <= outer.y + outer.height
    );
  },
  containsPoint(rect: Rect, po: Point) {
    return (
      inBetween(po.x, rect.x, rect.x + rect.width) &&
      inBetween(po.y, rect.y, rect.y + rect.height)
    );
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
