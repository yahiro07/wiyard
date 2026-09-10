import { useEffect, useRef } from "react";

export type PianoRollGridDisplaySpec = {
  contentW: number;
  contentH: number;
  viewW: number;
  viewH: number;
  contentX0: number;
  contentX1: number;
  contentY0: number;
  contentY1: number;
  cellW: number;
  cellH: number;
  numStepsFull: number;
  numKeysFull: number;
};

const blackKeys = [1, 3, 6, 8, 10];

function renderGrid(canvas: HTMLCanvasElement, ds: PianoRollGridDisplaySpec) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(-ds.contentX0, -ds.contentY0);

  const rightX = Math.min(ds.contentX1, ds.numStepsFull * ds.cellW);
  ctx.fillStyle = "#000";
  ctx.fillRect(
    ds.contentX0,
    ds.contentY0,
    rightX - ds.contentX0,
    ds.contentY1 - ds.contentY0,
  );

  for (let i = 0; i < ds.numKeysFull; i++) {
    const y = ds.contentH - i * ds.cellH - ds.cellH;
    if (ds.contentY0 <= y && y < ds.contentY1) {
      const isBlackKey = blackKeys.includes(i % 12);
      ctx.fillStyle = isBlackKey ? "#222" : "#333";
      ctx.fillRect(ds.contentX0, y, rightX - ds.contentX0, ds.cellH);
    }
  }

  for (let i = 0; i < ds.numStepsFull; i++) {
    const x = i * ds.cellW;
    if (ds.contentX0 <= x && x < ds.contentX1) {
      ctx.strokeStyle = i % 16 === 0 ? "#0f0" : "#060";
      ctx.beginPath();
      ctx.moveTo(x, ds.contentY0);
      ctx.lineTo(x, ds.contentY1);
      ctx.stroke();
    }
  }

  for (let i = 0; i < ds.numKeysFull; i++) {
    const y = (ds.numKeysFull - i) * ds.cellH;
    if (ds.contentY0 <= y && y < ds.contentY1) {
      ctx.strokeStyle = "#0f0";
      ctx.beginPath();
      ctx.moveTo(ds.contentX0, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export const PianoRollGrid = ({
  displaySpec: ds,
}: {
  displaySpec: PianoRollGridDisplaySpec;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      renderGrid(canvas, ds);
    }
  }, [ds]);

  return (
    <canvas
      className="bg-#888"
      ref={canvasRef}
      width={ds.viewW}
      height={ds.viewH}
      style={{ width: ds.viewW, height: ds.viewH }}
    />
  );
};
