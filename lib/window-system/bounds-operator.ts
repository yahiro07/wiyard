import { Point, Rect, Size, Vector } from "@lib/utils/common-types";
import { roundFloat } from "@lib/utils/number-helper";

type BoundsCornerSpec = "tl" | "tr" | "bl" | "br";

export function getOppositeCorner(corner: BoundsCornerSpec): BoundsCornerSpec {
  if (corner === "tl") {
    return "br";
  } else if (corner === "tr") {
    return "bl";
  } else if (corner === "bl") {
    return "tr";
  } else if (corner === "br") {
    return "tl";
  }
  return "tl";
}

export class BoundsOperator {
  private top: number;
  private left: number;
  private bottom: number;
  private right: number;
  constructor(attrs: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  }) {
    this.top = attrs.top;
    this.left = attrs.left;
    this.bottom = attrs.bottom;
    this.right = attrs.right;
  }
  static fromRect(rect: Rect): BoundsOperator {
    return new BoundsOperator({
      top: rect.y,
      left: rect.x,
      bottom: rect.y + rect.height,
      right: rect.x + rect.width,
    });
  }
  static fromCenterAndSize(center: Point, size: Size): BoundsOperator {
    return new BoundsOperator({
      top: center.y - size.height / 2,
      left: center.x - size.width / 2,
      bottom: center.y + size.height / 2,
      right: center.x + size.width / 2,
    });
  }
  extendTop(amount: number) {
    this.top -= amount;
    return this;
  }
  shrinkTop(amount: number) {
    this.top += amount;
    return this;
  }
  toRect(): Rect {
    return {
      x: this.left,
      y: this.top,
      width: this.right - this.left,
      height: this.bottom - this.top,
    };
  }
  toCenterAndSize(): { center: Point; size: Size } {
    return {
      center: {
        x: (this.left + this.right) / 2,
        y: (this.top + this.bottom) / 2,
      },
      size: { width: this.right - this.left, height: this.bottom - this.top },
    };
  }
  setCorner(corner: BoundsCornerSpec, po: Point) {
    if (corner === "tl") {
      this.left = po.x;
      this.top = po.y;
    } else if (corner === "tr") {
      this.right = po.x;
      this.top = po.y;
    } else if (corner === "bl") {
      this.left = po.x;
      this.bottom = po.y;
    } else if (corner === "br") {
      this.right = po.x;
      this.bottom = po.y;
    }
    this.normalize();
    return this;
  }
  // fixAspectRatio(fixedCorner: BoundsCornerSpec, asrSpec: number) {
  //   let width = this.right - this.left;
  //   let height = this.bottom - this.top;
  //   const currentAsr = width / height;
  //   if (currentAsr > asrSpec) {
  //     height = width / asrSpec;
  //   } else {
  //     width = height * asrSpec;
  //   }
  //   if (fixedCorner === "tl") {
  //     this.right = this.left + width;
  //     this.bottom = this.top + height;
  //   } else if (fixedCorner === "tr") {
  //     this.left = this.right - width;
  //     this.bottom = this.top + height;
  //   } else if (fixedCorner === "bl") {
  //     this.right = this.left + width;
  //     this.top = this.bottom - height;
  //   } else if (fixedCorner === "br") {
  //     this.left = this.right - width;
  //     this.top = this.bottom - height;
  //   }
  //   return this;
  // }
  scale(fixedCorner: BoundsCornerSpec, scaleRatio: number) {
    const width = (this.right - this.left) * scaleRatio;
    const height = (this.bottom - this.top) * scaleRatio;
    if (fixedCorner === "tl") {
      this.right = this.left + width;
      this.bottom = this.top + height;
    } else if (fixedCorner === "tr") {
      this.left = this.right - width;
      this.bottom = this.top + height;
    } else if (fixedCorner === "bl") {
      this.right = this.left + width;
      this.top = this.bottom - height;
    } else if (fixedCorner === "br") {
      this.left = this.right - width;
      this.top = this.bottom - height;
    }
    return this;
  }
  clampMinSize(fixedCorner: BoundsCornerSpec, minSize: Size) {
    const width = this.right - this.left;
    const height = this.bottom - this.top;
    if (width < minSize.width) {
      if (fixedCorner === "tl" || fixedCorner === "bl") {
        this.left = this.right - minSize.width;
      } else {
        this.right = this.left + minSize.width;
      }
    }
    if (height < minSize.height) {
      if (fixedCorner === "tl" || fixedCorner === "tr") {
        this.top = this.bottom - minSize.height;
      } else {
        this.bottom = this.top + minSize.height;
      }
    }
    return this;
  }
  getCorner(corner: BoundsCornerSpec): Point {
    if (corner === "tl") {
      return { x: this.left, y: this.top };
    } else if (corner === "tr") {
      return { x: this.right, y: this.top };
    } else if (corner === "bl") {
      return { x: this.left, y: this.bottom };
    } else if (corner === "br") {
      return { x: this.right, y: this.bottom };
    }
    return { x: this.left, y: this.top };
  }
  normalize() {
    if (this.left > this.right)
      [this.left, this.right] = [this.right, this.left];
    if (this.top > this.bottom)
      [this.top, this.bottom] = [this.bottom, this.top];
    return this;
  }
  clampInAreaKeepingSize(outer: Rect) {
    if (this.left < outer.x) {
      const d = outer.x - this.left;
      this.left += d;
      this.right += d;
    }
    if (this.right > outer.x + outer.width) {
      const d = this.right - (outer.x + outer.width);
      this.left -= d;
      this.right -= d;
    }
    if (this.top < outer.y) {
      const d = outer.y - this.top;
      this.top += d;
      this.bottom += d;
    }
    if (this.bottom > outer.y + outer.height) {
      const d = this.bottom - (outer.y + outer.height);
      this.top -= d;
      this.bottom -= d;
    }
    return this;
  }
  move(moveAmount: Vector) {
    this.left += moveAmount.x;
    this.right += moveAmount.x;
    this.top += moveAmount.y;
    this.bottom += moveAmount.y;
    return this;
  }
  roundCoord(fracDigits: number) {
    this.left = roundFloat(this.left, fracDigits);
    this.right = roundFloat(this.right, fracDigits);
    this.top = roundFloat(this.top, fracDigits);
    this.bottom = roundFloat(this.bottom, fracDigits);
    return this;
  }
}
