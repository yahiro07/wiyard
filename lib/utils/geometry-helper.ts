import { clampValue, inBetween } from "./number-helper";
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
  clampInRect(v: Vector, re: Rect) {
    return {
      x: clampValue(v.x, re.x, re.x + re.width),
      y: clampValue(v.y, re.y, re.y + re.height),
    };
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
  center(re: Rect) {
    return { x: re.x + re.width / 2, y: re.y + re.height / 2 };
  },
  corner(re: Rect, corner: "tl" | "tr" | "bl" | "br"): Point {
    if (corner === "tl") return { x: re.x, y: re.y };
    if (corner === "tr") return { x: re.x + re.width, y: re.y };
    if (corner === "bl") return { x: re.x, y: re.y + re.height };
    if (corner === "br") return { x: re.x + re.width, y: re.y + re.height };
    return { x: re.x, y: re.y };
  },
  containsRect(outer: Rect, inner: Rect) {
    return (
      inner.x >= outer.x &&
      inner.y >= outer.y &&
      inner.x + inner.width <= outer.x + outer.width &&
      inner.y + inner.height <= outer.y + outer.height
    );
  },
  containsPoint(re: Rect, po: Point) {
    return (
      inBetween(po.x, re.x, re.x + re.width) &&
      inBetween(po.y, re.y, re.y + re.height)
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
