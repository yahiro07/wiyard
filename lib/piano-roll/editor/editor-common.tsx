import { useEffect, useMemo, useRef } from "react";
import { useAppContext } from "../root/app-context";
import { bottomLimit } from "../utils/helpers";
import { DisplaySpec, GridDisplaySpec } from "./editor-types";

export function useGridDisplaySpec(
  displaySpec: DisplaySpec,
  contentBars: number,
  numPitches: number,
) {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const { viewW, viewH, cellW, cellH } = displaySpec;

  const nx = contentBars * 16;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
  const contentX1 = contentX0 + viewW;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const contentY0 = sight.yPosition * maxScrollY;
  const contentY1 = contentY0 + viewH;

  return useMemo(
    () => ({
      contentW,
      contentH,
      viewW,
      viewH,
      contentX0,
      contentX1,
      contentY0,
      contentY1,
      cellW,
      cellH,
      numStepsFull: nx,
      numPitchesFull: numPitches,
    }),
    [
      contentW,
      contentH,
      viewW,
      viewH,
      contentX0,
      contentX1,
      contentY0,
      contentY1,
      cellW,
      cellH,
      nx,
      numPitches,
    ],
  );
}

export const GridCanvas = ({
  displaySpec: ds,
  renderGrid,
}: {
  displaySpec: GridDisplaySpec;
  renderGrid: (canvas: HTMLCanvasElement, ds: GridDisplaySpec) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      renderGrid(canvas, ds);
    }
  }, [ds, renderGrid]);

  const width = Math.round(ds.viewW);
  const height = Math.round(ds.viewH);
  return (
    <canvas
      className="bg-#888"
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height }}
    />
  );
};
