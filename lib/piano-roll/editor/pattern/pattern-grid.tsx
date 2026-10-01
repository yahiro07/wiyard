import { uiColors } from "../../definitions/ui-theme";
import { GridDisplaySpec } from "../common/editor-types";
import { GridCanvas } from "../common/grid-canvas";

function renderGrid(canvas: HTMLCanvasElement, ds: GridDisplaySpec) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(-ds.contentX0, -ds.contentY0);

  const rightX = Math.min(ds.contentX1, ds.numStepsFull * ds.cellW);
  ctx.fillStyle = uiColors.clPatternGridBg;
  ctx.fillRect(
    ds.contentX0,
    ds.contentY0,
    rightX - ds.contentX0,
    ds.contentY1 - ds.contentY0,
  );

  ctx.fillStyle = uiColors.clPatternGridBgPrimary;
  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = ds.contentH - i * ds.cellH - ds.cellH;
    if (ds.contentY0 - ds.cellH <= y && y < ds.contentY1) {
      const isPrimary = i % 7 === 0;
      if (isPrimary) {
        ctx.fillRect(ds.contentX0, y, rightX - ds.contentX0, ds.cellH);
      }
    }
  }

  for (let i = 0; i < ds.numStepsFull; i++) {
    const x = i * ds.cellW;
    if (ds.contentX0 <= x && x < ds.contentX1) {
      let color = "#0002";
      if (i % 16 === 0) {
        color = "#0008";
      } else if (i % 4 === 0) {
        color = "#0004";
      }
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, ds.contentY0);
      ctx.lineTo(x, ds.contentY1);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "#0002";
  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = (ds.numPitchesFull - i) * ds.cellH;
    if (ds.contentY0 <= y && y < ds.contentY1) {
      ctx.beginPath();
      ctx.moveTo(ds.contentX0, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
  }

  //beat dots
  for (let i = 0; i < ds.numStepsFull; i++) {
    const x = i * ds.cellW + ds.cellW / 2;
    const y = ds.contentH - 7 * ds.cellH - ds.cellH + ds.cellH / 2;
    const r = 2.5;
    if (ds.contentX0 <= x + r && x < ds.contentX1) {
      const isBeatDot = i % 4 === 0;
      if (isBeatDot) {
        ctx.fillStyle = "#fff1";
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }
  }
  ctx.restore();
}

export const PatternGrid = ({
  displaySpec: ds,
}: {
  displaySpec: GridDisplaySpec;
}) => {
  return <GridCanvas displaySpec={ds} renderGrid={renderGrid} />;
};
