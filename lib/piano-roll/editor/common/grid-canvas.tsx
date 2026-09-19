import { useEffect, useRef } from "react";
import { GridDisplaySpec } from "./editor-types";

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
      className="bg-#282828"
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height }}
    />
  );
};
