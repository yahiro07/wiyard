import { Point, Rect, Size, Vector } from "@lib/utils/common-types";
import { rectOp, vectorOp } from "@lib/utils/geometry-helper";
import { BoundsOperator, getOppositeCorner } from "./bounds-operator";
import { windowTitleBarHeight } from "./constants";

export function getDeskAreaElement() {
  //todo: pass desk area element from app to window system
  return document.getElementById("domDeskArea") as HTMLElement;
}

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

export const windowPlacementHelper = {
  getDeskAreaBounds(): Rect {
    const el = getDeskAreaElement();
    return { x: 0, y: 0, width: el.offsetWidth, height: el.offsetHeight };
  },
  canAcceptWindowBounds(bounds: Rect): boolean {
    // const titleBarTopCenter = {
    //   x: bounds.x + bounds.width / 2,
    //   y: bounds.y,
    // };
    // const titleBarBottomCenter = {
    //   x: bounds.x + bounds.width / 2,
    //   y: bounds.y + windowTitleBarHeight,
    // };
    const deskAreaBounds = this.getDeskAreaBounds();
    return (
      rectOp.containsRect(deskAreaBounds, bounds) &&
      rectOp.containsPoint(deskAreaBounds, bounds)
    );
  },
  updateWindowBounds(
    originalWindowBounds: Rect,
    anchor: BoundsAnchor,
    anchorMoveAmount: Vector,
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
  },
  updatePosition(originalWindowBounds: Rect, moveAmount: Vector) {
    const deskAreaBounds = this.getDeskAreaBounds();
    const checkingBounds = {
      x: deskAreaBounds.x - originalWindowBounds.width * 0.75,
      y: deskAreaBounds.y,
      width: deskAreaBounds.width + originalWindowBounds.width * 1.5,
      height:
        deskAreaBounds.height +
        (originalWindowBounds.height - windowTitleBarHeight),
    };
    return BoundsOperator.fromRect(originalWindowBounds)
      .move(moveAmount)
      .clampInAreaKeepingSize(checkingBounds)
      .toRect();
  },
};
