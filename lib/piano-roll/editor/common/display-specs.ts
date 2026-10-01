import { bottomLimit, mapUnaryTo } from "@lib/utils/number-helper";
import { Size } from "../../../utils/common-types";
import { Sight } from "../../definitions/types";
import { DisplaySpec, GridDisplaySpec } from "./editor-types";
import { useMemo } from "react";
import { SongKeySpec } from "wafer-host/unit-types";
import { useAppContext } from "../../model/app-context";

export function fixSightWithLeftPadding(sight: Sight): Sight {
  if (sight.withXPadding) {
    const pad = sight.wBars / 12;
    return {
      ...sight,
      xBarPosition: sight.xBarPosition - pad / 2,
      wBars: sight.wBars + pad,
    };
  }
  return sight;
}

export function useDisplaySpec({
  nx,
  numPitches,
  sight,
  mainDivSize,
}: {
  nx: number;
  numPitches: number;
  sight: Sight;
  mainDivSize: Size | undefined;
}): DisplaySpec {
  const viewW = mainDivSize?.width ?? 100;
  const viewH = mainDivSize?.height ?? 100;

  const cellW = viewW / (sight.wBars * 16);
  // const cellW = mapUnaryTo(sight.xZoom, 10, 60);
  const cellH = mapUnaryTo(sight.yZoom, 15, 40);

  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  let ty = -sight.yPosition * maxScrollY;
  if (contentH < viewH) {
    ty = (viewH - contentH) / 2;
  }

  const contentX0 = sight.xBarPosition * cellW * 16;
  const tx = -contentX0;

  return { viewW, viewH, cellW, cellH, contentW, contentH, tx, ty };
}

export function useGridDisplaySpec(
  displaySpec: DisplaySpec,
  sectionDuration: number,
  numPitches: number,
  keySpec?: SongKeySpec,
): GridDisplaySpec {
  const { store } = useAppContext();
  const { sight: inputSight } = store.useSnapshot();
  const sight = fixSightWithLeftPadding(inputSight);

  const { viewW, viewH, cellW, cellH } = displaySpec;

  const nx = sectionDuration;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const contentX0 = sight.xBarPosition * cellW * 16;
  const contentX1 = contentX0 + viewW;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  let contentY0 = sight.yPosition * maxScrollY;
  let contentY1 = contentY0 + viewH;
  if (contentH < viewH) {
    contentY0 = -(viewH - contentH) / 2;
    contentY1 = contentH - contentY0;
  }

  const wBars = sight.wBars;

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
      keySpec,
      wBars,
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
      keySpec,
      wBars,
    ],
  );
}
