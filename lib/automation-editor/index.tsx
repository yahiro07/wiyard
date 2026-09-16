import { ReactUnitTemplateFn } from "wafer-host/react";
import { GridBackground } from "./grid-background";
import { Point, Size } from "@lib/utils/common-types";
import { useMemo, useRef } from "react";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { createStore } from "snap-store";
import { startPointerCaptureSession } from "@lib/utils/drag-session";

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
        points={points
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
      accessor.setPoints((prev) => {
        const newPoints = [...prev, po];
        newPoints.sort((a, b) => a.x - b.x);
        return newPoints;
      });
    },
    removePoint(po: Point) {
      accessor.setPoints((prev) => {
        return prev.filter((p) => p !== po);
      });
    },
  };
}

function createEditInputActions(accessor: StorePointsAccessor) {
  const pointsMutations = createPointsMutations(accessor);

  const core = {
    getHitTestRadius(e: PointerEvent) {
      const el = e.target as HTMLElement;
      const rect = el.getBoundingClientRect();
      return 8 / rect.width;
    },
    getPointCoord(e: PointerEvent) {
      const el = e.target as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      return { x, y };
    },
    hitTestPoints(pos: Point, radius: number) {
      const points = accessor.getPoints();
      return points.filter((po) => {
        const dx = po.x - pos.x;
        const dy = po.y - pos.y;
        return dx * dx + dy * dy <= radius * radius;
      })[0];
    },
  };

  return {
    handlePointerDown(e0: PointerEvent) {
      const pos = core.getPointCoord(e0);
      const hitTestRadius = core.getHitTestRadius(e0);
      const po = core.hitTestPoints(pos, hitTestRadius);
      if (po) {
        pointsMutations.removePoint(po);
      } else {
        pointsMutations.addPoint(pos);
        startPointerCaptureSession(e0, {
          onMove(e) {
            const pos = core.getPointCoord(e);
            pointsMutations.addPoint(pos);
          },
          onUpOrCancel(e, cause) {},
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
      onPointerDown={(e) => editInputActions.handlePointerDown(e.nativeEvent)}
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
