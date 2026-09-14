import { debugConfig } from "../../definitions/ui-config";
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
  ctx.fillStyle = uiColors.clDiatonicLanesGridBg;
  ctx.fillRect(
    ds.contentX0,
    ds.contentY0,
    rightX - ds.contentX0,
    ds.contentY1 - ds.contentY0,
  );

  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = ds.contentH - i * ds.cellH - ds.cellH;
    if (ds.contentY0 - ds.cellH <= y && y < ds.contentY1) {
      let i2 = i; //C
      if (debugConfig.keyAm) {
        i2 = i + 2; //Am
      }
      const isTonic = i2 % 7 === 0;
      const isDominant = i2 % 7 === 4;
      let color: string | undefined;
      if (isTonic) {
        color = uiColors.clDiatonicLanesGridBgTonic;
      } else if (isDominant) {
        // color = uiColors.clDiatonicLanesGridBgDominant;
      }
      if (color) {
        ctx.fillStyle = color;
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

  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = (ds.numPitchesFull - i) * ds.cellH;
    if (ds.contentY0 <= y && y < ds.contentY1) {
      const strong = i % 7 === 0 || i % 7 === 3;
      ctx.strokeStyle = strong ? "#0004" : "#0001";
      ctx.beginPath();
      ctx.moveTo(ds.contentX0, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export const DiatonicLanesGrid = ({
  displaySpec: ds,
}: {
  displaySpec: GridDisplaySpec;
}) => {
  return <GridCanvas displaySpec={ds} renderGrid={renderGrid} />;
};
