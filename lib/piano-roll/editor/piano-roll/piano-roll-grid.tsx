import { uiColors } from "../../definitions/ui-theme";
import { createCanvasShapeDrawing } from "../common/canvas-shape-drawing";
import { GridDisplaySpec } from "../common/editor-types";
import { GridCanvas } from "../common/grid-canvas";

const blackKeys = [1, 3, 6, 8, 10];

function renderGrid(canvas: HTMLCanvasElement, ds: GridDisplaySpec) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dg = createCanvasShapeDrawing(ctx);
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(-ds.contentX0, -ds.contentY0);

  const rightX = Math.min(ds.contentX1, ds.numStepsFull * ds.cellW);
  ctx.fillStyle = uiColors.clPianoRollBg;
  ctx.fillRect(
    ds.contentX0,
    ds.contentY0,
    rightX - ds.contentX0,
    ds.contentY1 - ds.contentY0,
  );

  //horizontal black key bands
  ctx.fillStyle = uiColors.clPianoRollBgBlackKey;
  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = ds.contentH - i * ds.cellH - ds.cellH;
    if (ds.contentY0 - ds.cellH <= y && y < ds.contentY1) {
      const isBlackKey = blackKeys.includes(i % 12);
      if (isBlackKey) {
        ctx.fillRect(ds.contentX0, y, rightX - ds.contentX0, ds.cellH);
      }
    }
  }

  //vertical lines
  let weakLineInterval = -1;
  if (ds.wBars <= 2) {
    weakLineInterval = 1;
  } else if (ds.wBars <= 4) {
    weakLineInterval = 2;
  }
  for (let i = 0; i < ds.numStepsFull; i++) {
    const x = i * ds.cellW;
    if (ds.contentX0 <= x && x < ds.contentX1) {
      let color = "#0000";
      if (i % 16 === 0) {
        color = "#0008";
      } else if (i % 4 === 0) {
        if (ds.wBars === 16 && i % 8 === 4) {
        } else {
          color = "#0004";
        }
      } else {
        if (weakLineInterval !== -1 && i % weakLineInterval === 0) {
          color = "#0002";
        }
      }
      ctx.strokeStyle = color;
      dg.drawLine(x, ds.contentY0, x, ds.contentY1);
    }
  }

  //horizontal lines
  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = (ds.numPitchesFull - i) * ds.cellH;
    if (ds.contentY0 <= y && y < ds.contentY1) {
      const isStrong = i % 12 === 0 || i % 12 === 5;
      ctx.strokeStyle = isStrong ? "#0003" : "#0001";
      dg.drawLine(ds.contentX0, y, rightX, y);
    }
  }

  //beat dots
  for (let i = 0; i < ds.numStepsFull; i++) {
    const x = i * ds.cellW + ds.cellW / 2;
    const y = ds.contentH - 24 * ds.cellH - ds.cellH + ds.cellH / 2;
    const y2 = ds.contentH - 36 * ds.cellH - ds.cellH + ds.cellH / 2;
    const r = 2.5;
    if (ds.contentX0 <= x + r && x < ds.contentX1) {
      const isBeatDot = i % 4 === 0;
      if (isBeatDot) {
        ctx.fillStyle = "#fff1";
        dg.fillCircle(x, y, r);
        dg.fillCircle(x, y2, r);
      }
    }
  }
  ctx.restore();
}

export const PianoRollGrid = ({
  displaySpec: ds,
}: {
  displaySpec: GridDisplaySpec;
}) => {
  return <GridCanvas displaySpec={ds} renderGrid={renderGrid} />;
};
