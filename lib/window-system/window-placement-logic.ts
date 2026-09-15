import { Point, Rect, Size } from "@lib/utils/common-types";
import { vectorOp } from "@lib/utils/geometry-helper";
import { BoundsOperator, getOppositeCorner } from "./bounds-operator";
import { windowTitleBarHeight } from "./constants";

export type BoundsAnchor = "tl" | "tr" | "bl" | "br";

type WindowSpecCoords = {
  position: Point;
  contentSize: Size;
};

export const windowBoundsConverter = {
  fromWindowSpecCoords({ position, contentSize }: WindowSpecCoords): Rect {
    return BoundsOperator.fromCenterAndSize(position, contentSize)
      .extendTop(windowTitleBarHeight)
      .toRect();
  },
  toWindowSpecCoords(windowBounds: Rect): WindowSpecCoords {
    const { center, size } = BoundsOperator.fromRect(windowBounds)
      .shrinkTop(windowTitleBarHeight)
      .toCenterAndSize();
    return { position: center, contentSize: size };
  },
};

export function updateWindowBounds(
  originalWindowBounds: Rect,
  anchor: BoundsAnchor,
  anchorMoveAmount: Point,
  options: { contentAspectRatioSpec?: number | null; minContentSize?: Size },
): Rect {
  if (!options.contentAspectRatioSpec) {
    const bo = BoundsOperator.fromRect(originalWindowBounds);
    const originalPoint = bo.getCorner(anchor);
    const movedAnchorPos = vectorOp.add(originalPoint, anchorMoveAmount);
    bo.setCorner(anchor, movedAnchorPos);
    if (options.minContentSize) {
      const oppositeAnchor = getOppositeCorner(anchor);
      bo.clampMinSize(oppositeAnchor, {
        width: options.minContentSize.width,
        height: options.minContentSize.height + windowTitleBarHeight,
      });
    }
    return bo.toRect();
  } else {
    const bo0 = BoundsOperator.fromRect(originalWindowBounds);
    bo0.shrinkTop(windowTitleBarHeight);
    const originalContentBounds = bo0.toRect();
    const originalPoint = bo0.getCorner(anchor);
    const movedAnchorPos = vectorOp.add(originalPoint, anchorMoveAmount);
    //
    const bo = BoundsOperator.fromRect(originalContentBounds);
    bo.setCorner(anchor, movedAnchorPos);
    const oppositeAnchor = getOppositeCorner(anchor);
    bo.fixAspectRatio(oppositeAnchor, options.contentAspectRatioSpec);
    if (options.minContentSize) {
      bo.clampMinSize(oppositeAnchor, options.minContentSize);
    }
    bo.extendTop(windowTitleBarHeight);
    return bo.toRect();
  }
}
