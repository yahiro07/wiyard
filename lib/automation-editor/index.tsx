import { ReactUnitTemplateFn } from "wafer-host/react";
import { GridBackground } from "./grid-background";
import { Point, Size } from "@lib/utils/common-types";
import { useMemo, useRef } from "react";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { createStore } from "snap-store";
import { createDragSessionEx } from "@lib/utils/drag-session";
import { resultOf } from "@lib/utils/general-helper";
import { clampValue, mapUnaryTo } from "@lib/utils/number-helper";

type StoreSetterFn<T> = (value: T | ((prev: T) => T)) => void;

type KnotPoint = {
  x: number;
  y: number;
  curved: boolean;
};

type SetPointsFn = StoreSetterFn<KnotPoint[]>;

function mapPointsDisplayLayerPoints(inputPoints: KnotPoint[]): {
  points: KnotPoint[];
  polyPoints: Point[];
} {
  const points = inputPoints.map((po) => ({
    x: po.x,
    //slightly add paddings to the edge of edit area
    y: mapUnaryTo(po.y, 0.01, 0.99),
    curved: po.curved,
  }));
  const polyPoints = resultOf(() => {
    //add end points at x=0 and x=1
    const firstP = points.at(0);
    const lastP = points.at(-1);
    const noOp =
      !firstP ||
      !lastP ||
      (firstP &&
        lastP &&
        lastP !== firstP &&
        firstP.x < 0.01 &&
        lastP.x > 0.99);
    if (noOp) return points;

    const newPoints = [...points];
    if (firstP.x > 0.01) {
      newPoints.unshift({ x: 0, y: firstP.y, curved: false });
    }
    if (lastP.x < 0.99) {
      newPoints.push({ x: 1, y: lastP.y, curved: false });
    }
    return newPoints;
  });
  return { points, polyPoints };
}

const PointsDisplayLayer = ({
  points: inputPoints,
  size,
  color,
}: {
  points: KnotPoint[];
  size: Size;
  color: string;
}) => {
  const { points, polyPoints } = mapPointsDisplayLayerPoints(inputPoints);
  return (
    <svg viewBox={`0 0 ${size.width} ${size.height}`} className="w-full h-full">
      <g>
        {points.map((po, i) => {
          return (
            <circle
              key={i}
              cx={po.x * size.width}
              cy={(1 - po.y) * size.height}
              r={5}
              fill={!po.curved ? color : "none"}
              stroke={po.curved ? color : "none"}
            />
          );
        })}
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
  getPoints(): KnotPoint[];
  usePoints(): KnotPoint[];
  setPoints: SetPointsFn;
};

function createPointsMutations(accessor: StorePointsAccessor) {
  return {
    addPoint(po: KnotPoint) {
      accessor.setPoints((prev) => [...prev, po].sort((a, b) => a.x - b.x));
    },
    replacePoint(target: KnotPoint, po: KnotPoint) {
      accessor.setPoints((prev) =>
        prev.map((p) => (p === target ? po : p)).sort((a, b) => a.x - b.x),
      );
    },
    removePoint(po: KnotPoint) {
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
    points: KnotPoint[],
    pos: Point,
    radii: { rx: number; ry: number },
  ): KnotPoint | undefined {
    return points.find((po) => {
      const dx = (po.x - pos.x) / radii.rx;
      const dy = (po.y - pos.y) / radii.ry;
      return dx * dx + dy * dy <= 1;
    });
  },
  xBoundsFor(points: Point[], target: Point) {
    const i = points.findIndex((p) => p === target);
    const prev = i > 0 ? points[i - 1] : undefined;
    const next = i >= 0 && i < points.length - 1 ? points[i + 1] : undefined;
    return {
      minX: prev?.x ?? 0,
      maxX: next?.x ?? 1,
    };
  },
};

function createEditInputActions(accessor: StorePointsAccessor) {
  const pointsMutations = createPointsMutations(accessor);

  return {
    handlePointerDown(e0: React.PointerEvent) {
      const ds = createDragSessionEx(e0);
      const viewSpace = createViewSpace(ds.getBaseSize());
      const startPos = viewSpace.toNormalized(ds.getStartPosition(), true);
      const hit = helpers.hitTestPoint(
        accessor.getPoints(),
        startPos,
        viewSpace.hitRadii(8),
      );

      const editMode = hit ? "edit" : "create";
      let latestPoint: KnotPoint;
      if (hit) {
        latestPoint = hit;
      } else {
        const startPoint = { x: startPos.x, y: startPos.y, curved: false };
        pointsMutations.addPoint(startPoint);
        latestPoint = startPoint;
      }
      const bounds = helpers.xBoundsFor(accessor.getPoints(), latestPoint);

      const operations = {
        toggleCurved() {
          if (editMode === "edit" && latestPoint !== store.state.points[0]) {
            const newPoint = { ...latestPoint, curved: !latestPoint.curved };
            pointsMutations.replacePoint(latestPoint, newPoint);
            latestPoint = newPoint;
          }
        },
        updatePosition(pos: Point) {
          const newPoint = { x: pos.x, y: pos.y, curved: latestPoint.curved };
          pointsMutations.replacePoint(latestPoint, newPoint);
          latestPoint = newPoint;
        },
        remove() {
          if (editMode === "edit") {
            pointsMutations.removePoint(latestPoint);
          }
        },
      };

      ds.run({
        onMove(inputPos) {
          const pos = resultOf(() => {
            const normPos = viewSpace.toNormalized(inputPos, true);
            return {
              x: clampValue(normPos.x, bounds.minX, bounds.maxX),
              y: normPos.y,
            };
          });
          operations.updatePosition(pos);
        },
        onTap() {
          operations.remove();
        },
        onHold() {
          operations.toggleCurved();
        },
      });
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

const MultiPointsEditor = ({ accessor }: { accessor: StorePointsAccessor }) => {
  const points = accessor.usePoints();
  const baseDivRef = useRef<HTMLDivElement>(null);
  const size = useDomElementSize(baseDivRef) ?? { width: 0, height: 0 };
  const color = "#79f";

  return (
    <div ref={baseDivRef} className="w-full h-full relative">
      <PointsDisplayLayer points={points} size={size} color={color} />
      <EditInputLayer accessor={accessor} />
    </div>
  );
};

const defaultPoints: KnotPoint[] = [
  { x: 0, y: 0, curved: false },
  { x: 1, y: 1, curved: false },
];
const store = createStore<{ points: KnotPoint[] }>({ points: defaultPoints });

const App = () => {
  const accessor = useMemo(() => {
    return {
      getPoints: () => store.state.points,
      usePoints: () => store.useSnapshot().points,
      setPoints: store.setPoints,
    };
  }, []);
  return (
    <div className="bg-#ccc p-3 flex-vc gap-2">
      <h3>Automation Editor</h3>
      <div className="grow bd-#666 w-800px h-180px relative">
        <GridBackground nx={8} ny={1} />
        <div className="absolute-full">
          <MultiPointsEditor accessor={accessor} />
        </div>
      </div>
      {/* <div className="bd-#666 w-400px h-300px">
        <MultiPointsEditor accessor={accessor} />
      </div> */}
    </div>
  );
};

export const createAutomationEditorUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const automationOutputPort = unitInterface.createAutomationOutputPort();
  const timerId = setInterval(() => {
    automationOutputPort.emitValue(Math.random());
  }, 1000);
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    cleanup() {
      clearInterval(timerId);
    },
  });
  return {
    RenderUi() {
      return <App />;
    },
  };
};
