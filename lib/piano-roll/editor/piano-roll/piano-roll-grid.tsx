import { uiColors } from "../../definitions/ui-theme";
import { GridDisplaySpec } from "../common/editor-types";
import { GridCanvas } from "../common/grid-canvas";

const blackKeys = [1, 3, 6, 8, 10];

function renderGrid(canvas: HTMLCanvasElement, ds: GridDisplaySpec) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
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
      ctx.beginPath();
      ctx.moveTo(x, ds.contentY0);
      ctx.lineTo(x, ds.contentY1);
      ctx.stroke();
    }
  }

  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = (ds.numPitchesFull - i) * ds.cellH;
    if (ds.contentY0 <= y && y < ds.contentY1) {
      const isStrong = i % 12 === 0 || i % 12 === 5;
      ctx.strokeStyle = isStrong ? "#0003" : "#0001";
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
  displaySpec: GridDisplaySpec;
}) => {
  return <GridCanvas displaySpec={ds} renderGrid={renderGrid} />;
};
