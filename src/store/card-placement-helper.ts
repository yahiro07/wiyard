import { store } from "@/store/store";
import { Point } from "@lib/utils/common-types";
import { clampValue } from "@lib/utils/number-helper";

export const cardPlacementHelper = {
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
};
