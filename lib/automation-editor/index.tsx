import { ReactUnitTemplateFn } from "wafer-host/react";
import { GridBackground } from "./grid-background";
import { Point, Size } from "@lib/utils/common-types";
import { useMemo, useRef } from "react";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { createStore } from "snap-store";
import { createDragSession } from "@lib/utils/drag-session";
import { resultOf } from "@lib/utils/general-helper";
import { clampValue } from "@lib/utils/number-helper";

type StoreSetterFn<T> = (value: T | ((prev: T) => T)) => void;

type SetPointsFn = StoreSetterFn<Point[]>;

const PointsDisplayLayer = ({
  points,
  size,
  color,
}: {
  points: Point[];
  size: Size;
  color: string;
}) => {
  const polyPoints = resultOf(() => {
    const lastP = points.at(-1);
    if (lastP && lastP.x < 0.99) {
      return [...points, { x: 1, y: lastP.y }];
    }
    return points;
  });
  return (
    <svg viewBox={`0 0 ${size.width} ${size.height}`} className="w-full h-full">
      <g>
        {points.map((po, i) => (
          <circle
            key={i}
            cx={po.x * size.width}
            cy={(1 - po.y) * size.height}
            r={6}
            fill={color}
          />
        ))}
      </g>
      <polyline
        points={polyPoints
          .map((po) => `${po.x * size.width} ${(1 - po.y) * size.height}`)
          .join(" ")}
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};

type StorePointsAccessor = {
  getPoints(): Point[];
  setPoints: SetPointsFn;
};

function createPointsMutations(accessor: StorePointsAccessor) {
  return {
    addPoint(po: Point) {
      accessor.setPoints((prev) => [...prev, po].sort((a, b) => a.x - b.x));
    },
    replacePoint(target: Point, po: Point) {
      accessor.setPoints((prev) =>
        prev.map((p) => (p === target ? po : p)).sort((a, b) => a.x - b.x),
      );
    },
    removePoint(po: Point) {
      accessor.setPoints((prev) => {
        return prev.filter((p) => p !== po);
      });
    },
  };
}

function createViewSpace(size: Size) {
  return {
    toNormalized(pos: Point, clamp?: boolean) {
      const x = pos.x / size.width;
      const y = 1 - pos.y / size.height;
      if (clamp) {
        return { x: clampValue(x, 0, 1), y: clampValue(y, 0, 1) };
      } else {
        return { x, y };
      }
    },
    hitRadii(pixelRadius: number) {
      return { rx: pixelRadius / size.width, ry: pixelRadius / size.height };
    },
  };
}

const helpers = {
  hitTestPoint(
    points: Point[],
    pos: Point,
    radii: { rx: number; ry: number },
  ): Point | undefined {
    return points.find((po) => {
      const dx = (po.x - pos.x) / radii.rx;
      const dy = (po.y - pos.y) / radii.ry;
      return dx * dx + dy * dy <= 1;
    });
  },
};

function createEditInputActions(accessor: StorePointsAccessor) {
  const pointsMutations = createPointsMutations(accessor);

  return {
    handlePointerDown(e0: React.PointerEvent) {
      const ds = createDragSession(e0);
      const viewSpace = createViewSpace(ds.getBaseSize());
      const startPos = viewSpace.toNormalized(ds.getStartPosition(), true);
      const hit = helpers.hitTestPoint(
        accessor.getPoints(),
        startPos,
        viewSpace.hitRadii(8),
      );
      if (hit) {
        pointsMutations.removePoint(hit);
      } else {
        pointsMutations.addPoint(startPos);
        let latestPoint = startPos;
        ds.run({
          onMove(inputPos) {
            const pos = viewSpace.toNormalized(inputPos, true);
            pointsMutations.replacePoint(latestPoint, pos);
            latestPoint = pos;
          },
          onEnd() {},
        });
      }
    },
  };
}

const EditInputLayer = ({ accessor }: { accessor: StorePointsAccessor }) => {
  const editInputActions = createEditInputActions(accessor);
  return (
    <div
      className="absolute-full"
      onPointerDown={(e) => editInputActions.handlePointerDown(e)}
    />
  );
};

const MultiPointsEditor = ({
  points,
  setPoints,
}: {
  points: Point[];
  setPoints: SetPointsFn;
}) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const size = useDomElementSize(baseDivRef) ?? { width: 0, height: 0 };
  const color = "#79f";
  const accessor = useMemo(() => {
    return { getPoints: () => points, setPoints: setPoints };
  }, [points, setPoints]);
  return (
    <div ref={baseDivRef} className="w-full h-full relative">
      <PointsDisplayLayer points={points} size={size} color={color} />
      <EditInputLayer accessor={accessor} />
    </div>
  );
};

const defaultPoints: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];
const store = createStore<{ points: Point[] }>({ points: defaultPoints });

const App = () => {
  const st = store.useSnapshot();
  return (
    <div className="bg-#ccc p-3 flex-vc gap-2">
      <h3>Automation Editor</h3>
      <div className="grow bd-#666 w-800px h-180px">
        <GridBackground nx={8} ny={1} />
      </div>
      <div className="bd-#666 w-400px h-300px">
        <MultiPointsEditor points={st.points} setPoints={store.setPoints} />
      </div>
    </div>
  );
};

export const createAutomationEditorUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
  });
  return {
    RenderUi() {
      return <App />;
    },
  };
};
