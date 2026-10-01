import { fallbackKeySpec } from "../../definitions/ui-config";
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
  const keySpec = ds.keySpec ?? fallbackKeySpec;
  const trDiatonic = Math.round((keySpec.relativeKeyTranspose * 7) / 12);

  for (let i = 0; i < ds.numPitchesFull; i++) {
    const y = ds.contentH - i * ds.cellH - ds.cellH;
    if (ds.contentY0 - ds.cellH <= y && y < ds.contentY1) {
      const i2 = i - trDiatonic;
      const isTonic = keySpec.mode === "major" ? i2 % 7 === 0 : i2 % 7 === 5;
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
      const i2 = i - trDiatonic;
      const strong = i2 % 7 === 0 || i2 % 7 === 3;
      ctx.strokeStyle = strong ? "#0004" : "#0001";
      ctx.beginPath();
      ctx.moveTo(ds.contentX0, y);
      ctx.lineTo(rightX, y);
      ctx.stroke();
    }
  }

  //beat dots
  for (let i = 0; i < ds.numStepsFull; i++) {
    const x = i * ds.cellW + ds.cellW / 2;
    const y =
      ds.contentH -
      (14 + trDiatonic + (keySpec.mode === "minor" ? 5 : 0)) * ds.cellH -
      ds.cellH +
      ds.cellH / 2;
    const y2 = y - 7 * ds.cellH;
    const r = 2.5;

    if (ds.contentX0 <= x + r && x < ds.contentX1) {
      const isBeatDot = i % 4 === 0;
      if (isBeatDot) {
        ctx.fillStyle = "#fff1";
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.fillRect(x - r, y2 - r, r * 2, r * 2);
      }
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
