import { startDragSession } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { clampValue } from "@lib/utils/number-helper";
import { GraphSpec } from "@/domain/types";
import { cardPlacementHelper } from "@/store/card-placement-helper";
import { store } from "@/store/store";

const graphActions = {
  patchGraphSpecWithCardsClamped(attrs: Partial<GraphSpec>) {
    const { graphSpec, unitItems } = store.state;
    const newGraphSpec = { ...graphSpec, ...attrs };
    const newUnitItems = cardPlacementHelper.constrainAllUnitCardsInGraphPlane(
      unitItems,
      newGraphSpec,
    );
    if (newUnitItems !== unitItems) {
      store.setUnitItems(newUnitItems);
    }
    store.patchGraphSpec(attrs);
  },
};

export const graphPlaneHandlers = {
  handleMoveButtonPointerDown(e: React.PointerEvent<HTMLElement>) {
    const { graphSpec } = store.state;
    const { contentOffset: originalOffset, contentScaling: scaling } =
      graphSpec;
    startDragSession(e, {
      onMove(_, delta) {
        const newOffset = vectorOp.snapped(
          vectorOp.add(originalOffset, vectorOp.scale(delta, 1 / scaling)),
          10,
        );
        graphActions.patchGraphSpecWithCardsClamped({
          contentOffset: newOffset,
        });
      },
    });
  },
  handleScaleButtonPointerDown(e: React.PointerEvent<HTMLElement>) {
    const { graphSpec } = store.state;
    const { contentScaling: originalScaling } = graphSpec;
    startDragSession(e, {
      onMove(_, delta) {
        const newScaling = clampValue(
          originalScaling - delta.y * 0.01,
          0.4,
          1.4,
        );
        graphActions.patchGraphSpecWithCardsClamped({
          contentScaling: newScaling,
        });
      },
    });
  },
  handlePlaneResizeAnchorPointerDown(e: React.PointerEvent<HTMLElement>) {
    const {
      graphSpec: { planeSize: originalSize },
      boardSize,
    } = store.state;
    const wMin = 400;
    const hMin = 300;
    const wMax = boardSize.width;
    const hMax = boardSize.height;
    startDragSession(e, {
      onMove(_, delta) {
        const tw = (originalSize.width / 2 + delta.x) * 2;
        const th = (originalSize.height / 2 + delta.y) * 2;
        const newSize = {
          width: clampValue(tw, wMin, wMax),
          height: clampValue(th, hMin, hMax),
        };
        graphActions.patchGraphSpecWithCardsClamped({ planeSize: newSize });
      },
    });
  },
};
