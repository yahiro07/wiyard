import { GraphSpec } from "@/domain/types";
import { cardPlacementHelper } from "@/store/card-placement-helper";
import { store } from "@/store/store";
import { startDragSession } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { clampValue } from "@lib/utils/number-helper";

const graphActions = {
  patchGraphSpec<K extends keyof GraphSpec>(key: K, value: GraphSpec[K]) {
    store.patchGraphSpec({ [key]: value });
  },
  patchGraphSpecWithCheck<K extends keyof GraphSpec>(
    key: K,
    value: GraphSpec[K],
  ) {
    const { graphSpec, unitItems } = store.state;
    const newGraphSpec = { ...graphSpec, [key]: value };
    const valid = cardPlacementHelper.checkAllCardsInGraphPlane(
      unitItems,
      newGraphSpec,
    );
    if (!valid) return;
    store.patchGraphSpec({ [key]: value });
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
        graphActions.patchGraphSpecWithCheck("contentOffset", newOffset);
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
        graphActions.patchGraphSpecWithCheck("contentScaling", newScaling);
      },
    });
  },
  handlePlaneResizeAnchorPointerDown(e: React.PointerEvent<HTMLElement>) {
    const { planeSize: originalSize } = store.state.graphSpec;
    startDragSession(e, {
      onMove(_, delta) {
        const newSize = {
          width: (originalSize.width / 2 + delta.x) * 2,
          height: (originalSize.height / 2 + delta.y) * 2,
        };
        graphActions.patchGraphSpecWithCheck("planeSize", newSize);
      },
    });
  },
};
