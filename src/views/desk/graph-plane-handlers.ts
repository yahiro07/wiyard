import { GraphSpec } from "@/domain/types";
import { store } from "@/store/store";
import { startDragSession } from "@lib/utils/drag-session";
import { vectorOp } from "@lib/utils/geometry-helper";
import { clampValue } from "@lib/utils/number-helper";

const graphActions = {
  patchGraphSpec<K extends keyof GraphSpec>(key: K, value: GraphSpec[K]) {
    store.patchGraphSpec({ [key]: value });
  },
};

export const graphPlaneHandlers = {
  handleMoveButtonPointerDown(e: React.PointerEvent<HTMLElement>) {
    const { contentOffset: originalOffset, contentScaling: scaling } =
      store.state.graphSpec;
    startDragSession(e, {
      onMove(_, delta) {
        const newOffset = vectorOp.add(
          originalOffset,
          vectorOp.scale(delta, 1 / scaling),
        );
        graphActions.patchGraphSpec("contentOffset", newOffset);
      },
    });
  },
  handleScaleButtonPointerDown(e: React.PointerEvent<HTMLElement>) {
    const originalScaling = store.state.graphSpec.contentScaling;
    startDragSession(e, {
      onMove(_, delta) {
        const newScaling = clampValue(
          originalScaling - delta.y * 0.01,
          0.4,
          1.4,
        );
        graphActions.patchGraphSpec("contentScaling", newScaling);
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
        graphActions.patchGraphSpec("planeSize", newSize);
      },
    });
  },
};
