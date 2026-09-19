import { GridBackground } from "./grid-background";
import { Point, Size } from "@lib/utils/common-types";
import { useRef } from "react";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { createDragSessionEx } from "@lib/utils/drag-session";
import { resultOf } from "@lib/utils/general-helper";
import { clampValue, mapUnaryTo } from "@lib/utils/number-helper";
import { CurveSegment, KnotPoint } from "./types";

type StoreSetterFn<T> = (value: T | ((prev: T) => T)) => void;

type SetPointsFn = StoreSetterFn<KnotPoint[]>;

const knotHelpers = {
  mapPointsDisplayLayerPoints(points: KnotPoint[]) {
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
    return polyPoints;
  },
  mapCoord(p: Point, areaSize: Size, paddingY: number): Point {
    const y0 = paddingY;
    const y1 = areaSize.height - paddingY;
    return {
      x: p.x * areaSize.width,
      y: mapUnaryTo(p.y, y1, y0),
    };
  },
  mapSegmentCoords(
    segments: CurveSegment[],
    areaSize: Size,
    paddingY: number,
  ): CurveSegment[] {
    return segments.map((segment) => ({
      type: segment.type,
      points: segment.points.map((p) =>
        knotHelpers.mapCoord(p, areaSize, paddingY),
      ),
    })) as CurveSegment[];
  },
  mapPolyPointsToSegments(points: KnotPoint[]): CurveSegment[] {
    if (points.length < 2) return [];

    const slope = (a: Point, b: Point) => {
      const dx = b.x - a.x;
      return dx === 0 ? 0 : (b.y - a.y) / dx;
    };
    const outgoingSlope = (i: number) => {
      const a = points[i];
      const b = points[i + 1];
      if (!b) return 0;
      if (!a.curved) return slope(a, b);
      const prev = points[i - 1];
      return prev ? slope(prev, b) : slope(a, b);
    };
    const incomingSlope = (i: number) => {
      const b = points[i];
      const a = points[i - 1];
      if (!a) return 0;
      if (!b.curved) return slope(a, b);
      const next = points[i + 1];
      return next ? slope(a, next) : slope(a, b);
    };

    const segments: CurveSegment[] = [];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (!a.curved && !b.curved) {
        segments.push({ type: "line", points: [a, b] });
        continue;
      }
      const dx = b.x - a.x;
      const m0 = outgoingSlope(i - 1);
      const m1 = incomingSlope(i);
      segments.push({
        type: "curve",
        points: [
          a,
          { x: a.x + dx / 3, y: a.y + (m0 * dx) / 3 },
          { x: b.x - dx / 3, y: b.y - (m1 * dx) / 3 },
          b,
        ],
      });
    }
    return segments;
  },
  mapSegmentsToPath(segments: CurveSegment[]): string {
    const first = segments[0];
    if (!first) return "";
    const cmds = [`M ${first.points[0].x},${first.points[0].y}`];
    for (const segment of segments) {
      if (segment.type === "line") {
        const [, p1] = segment.points;
        cmds.push(`L ${p1.x},${p1.y}`);
      } else {
        const [, c1, c2, p1] = segment.points;
        cmds.push(`C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`);
      }
    }
    return cmds.join(" ");
  },
};

const PointsDisplayLayer = ({
  points: inputPoints,
  size,
  color,
}: {
  points: KnotPoint[];
  size: Size;
  color: string;
}) => {
  const points = inputPoints.map((po) => ({
    ...knotHelpers.mapCoord(po, size, 1),
    curved: po.curved,
  }));
  const displayLayerPoints =
    knotHelpers.mapPointsDisplayLayerPoints(inputPoints);
  const segments = knotHelpers.mapPolyPointsToSegments(displayLayerPoints);
  const displaySegments = knotHelpers.mapSegmentCoords(segments, size, 1);
  const polyPointsPath = knotHelpers.mapSegmentsToPath(displaySegments);
  return (
    <svg viewBox={`0 0 ${size.width} ${size.height}`} className="w-full h-full">
      <g>
        {points.map((po, i) => {
          return (
            <circle
              key={i}
              cx={po.x}
              cy={po.y}
              r={5}
              fill={!po.curved ? color : "none"}
              stroke={po.curved ? color : "none"}
            />
          );
        })}
      </g>
      <path d={polyPointsPath} stroke={color} strokeWidth={2} fill="none" />
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
          if (latestPoint !== accessor.getPoints()[0]) {
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

export const CurveEditorRoot = ({
  accessor,
}: {
  accessor: StorePointsAccessor;
}) => {
  return (
    <div className="grow bd-#666 w-full relative">
      <GridBackground nx={8} ny={1} />
      <div className="absolute-full">
        <MultiPointsEditor accessor={accessor} />
      </div>
    </div>
  );
};
