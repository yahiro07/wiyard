import { GraphSpec, UnitItem } from "@/domain/types";
import { store } from "@/store/store";
import { Point, Rect } from "@lib/utils/common-types";
import { rectOp } from "@lib/utils/geometry-helper";
import { clampValue } from "@lib/utils/number-helper";

export const cardPlacementHelper = {
  getGraphPlaneVisibleAreaBounds(graphSpec: GraphSpec): Rect {
    const {
      contentOffset,
      contentScaling,
      planeSize: { width: w, height: h },
    } = graphSpec;
    const sc = contentScaling;
    const cx = -contentOffset.x;
    const cy = -contentOffset.y;
    const hx = w / 2 / sc;
    const hy = h / 2 / sc;
    const left = cx - hx;
    const right = cx + hx;
    const top = cy - hy;
    const bottom = cy + hy;
    return { x: left, y: top, width: right - left, height: bottom - top };
  },
  clampCardPositionInGraphPlane(
    position: Point,
    isSquareCard: boolean = false,
  ) {
    const { graphSpec } = store.state;
    const {
      contentOffset,
      contentScaling,
      planeSize: { width: w, height: h },
    } = graphSpec;
    const sc = contentScaling;

    const cardHalfHeight = 50 * sc;
    const cardHalfWidth = (isSquareCard ? 50 : 80) * sc;

    const cx = -contentOffset.x;
    const cy = -contentOffset.y;
    const hx = (w / 2 - cardHalfWidth) / sc;
    const hy = (h / 2 - cardHalfHeight) / sc;

    const left = cx - hx;
    const right = cx + hx;
    const top = cy - hy;
    const bottom = cy + hy;
    return {
      x: clampValue(position.x, left, right),
      y: clampValue(position.y, top, bottom),
    };
  },
  checkAllCardsInGraphPlane(uniteItems: UnitItem[], graphSpec: GraphSpec) {
    const visibleAreaBounds = this.getGraphPlaneVisibleAreaBounds(graphSpec);
    for (const item of uniteItems) {
      const size =
        item.type === "board"
          ? { width: 160, height: 100 }
          : { width: 100, height: 100 };
      const cardBounds = rectOp.fromCenterAndSize(item.cardPosition, size);
      if (!rectOp.containsRect(visibleAreaBounds, cardBounds)) {
        // console.log(`unit ${item.unitId} violates graph plane`);
        return false;
      }
    }
    return true;
  },
};
