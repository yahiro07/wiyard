import { Point, Rect, Size, Vector } from "@lib/utils/common-types";
import { rectOp, vectorOp } from "@lib/utils/geometry-helper";
import { clampValue } from "@lib/utils/number-helper";
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

const internalHelper = {
  getDeskAreaBounds(): Rect {
    // const el = getDeskAreaElement();
    // return { x: 0, y: 0, width: el.offsetWidth, height: el.offsetHeight };
    return { x: 0, y: 0, width: 4000, height: 2800 };
  },
  computeMaxScaleRatioInDesk(
    contentBounds: Rect,
    fixedCorner: BoundsAnchor,
    desk: Rect,
  ): number {
    const W = contentBounds.width;
    const H = contentBounds.height;
    const p0 = rectOp.corner(contentBounds, fixedCorner);
    const deskR = desk.x + desk.width;
    const deskB = desk.y + desk.height;
    const TB = windowTitleBarHeight;
    const limits: number[] = [];
    switch (fixedCorner) {
      case "tl":
        limits.push((deskR - p0.x) / W);
        limits.push((deskB - p0.y) / H);
        break;
      case "tr":
        limits.push((p0.x - desk.x) / W);
        limits.push((deskB - p0.y) / H);
        break;
      case "bl":
        limits.push((deskR - p0.x) / W);
        limits.push((p0.y - TB - desk.y) / H);
        break;
      case "br":
        limits.push((p0.x - desk.x) / W);
        limits.push((p0.y - TB - desk.y) / H);
        break;
    }
    return Math.min(...limits.filter((v) => v > 0 && Number.isFinite(v)));
  },
};

export const windowPlacementHelper = {
  updateSize(
    originalWindowBounds: Rect,
    anchor: BoundsAnchor,
    anchorMoveAmount: Vector,
    options: { contentAspectRatioSpec?: number | null; minContentSize?: Size },
  ): Rect | null {
    const deskAreaBounds = internalHelper.getDeskAreaBounds();
    if (!options.contentAspectRatioSpec) {
      const bo = BoundsOperator.fromRect(originalWindowBounds);
      const originalPoint = bo.getCorner(anchor);
      const movedAnchorPos = vectorOp.clampInRect(
        vectorOp.add(originalPoint, anchorMoveAmount),
        deskAreaBounds,
      );
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
      const oppositeAnchor = getOppositeCorner(anchor);
      const p0 = bo0.getCorner(oppositeAnchor);
      const p1 = bo0.getCorner(anchor);
      const originalDistance = vectorOp.distance(p0, p1);
      const p1a = vectorOp.add(p1, anchorMoveAmount);

      const movedDistance = vectorOp.distance(p0, p1a);
      let minScaleRatio = 1e-3;
      if (options.minContentSize) {
        minScaleRatio =
          options.minContentSize.width / originalContentBounds.width;
      }
      if (!rectOp.containsRect(deskAreaBounds, originalContentBounds)) {
        minScaleRatio = 1;
      }
      const maxScaleRatio = internalHelper.computeMaxScaleRatioInDesk(
        originalContentBounds,
        oppositeAnchor,
        deskAreaBounds,
      );

      const scaleRatio = clampValue(
        movedDistance / originalDistance,
        minScaleRatio,
        maxScaleRatio,
      );
      //
      const bo = BoundsOperator.fromRect(originalContentBounds);
      bo.scale(oppositeAnchor, scaleRatio);
      bo.extendTop(windowTitleBarHeight);
      return bo.toRect();
    }
  },
  updatePosition(originalWindowBounds: Rect, moveAmount: Vector) {
    const deskAreaBounds = internalHelper.getDeskAreaBounds();
    const checkingBounds = {
      x: deskAreaBounds.x,
      y: deskAreaBounds.y,
      width: deskAreaBounds.width,
      height: deskAreaBounds.height,
    };
    return BoundsOperator.fromRect(originalWindowBounds)
      .move(moveAmount)
      .clampInAreaKeepingSize(checkingBounds)
      .roundCoord(0)
      .toRect();
  },
};
