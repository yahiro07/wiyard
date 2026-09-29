import { bottomLimit, mapUnaryTo } from "@lib/utils/number-helper";
import { Size } from "../../../utils/common-types";
import { Sight } from "../../definitions/types";
import { DisplaySpec } from "./editor-types";
import { useMemo } from "react";
import { SongKeySpec } from "wafer-host/unit-types";
import { useAppContext } from "../../root/app-context";

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
  const cellH = mapUnaryTo(sight.yZoom, 10, 50);

  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const ty = -sight.yPosition * maxScrollY;

  // const maxScrollX = bottomLimit(contentW - viewW, 0);
  // const contentX0 = sight.xPosition * maxScrollX;
  const contentX0 = sight.xBarPosition * cellW * 16;
  const tx = -contentX0;

  return { viewW, viewH, cellW, cellH, contentW, contentH, tx, ty };
}

export function useGridDisplaySpec(
  displaySpec: DisplaySpec,
  sectionDuration: number,
  numPitches: number,
  keySpec?: SongKeySpec,
) {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const { viewW, viewH, cellW, cellH } = displaySpec;

  const nx = sectionDuration;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  // const maxScrollX = bottomLimit(contentW - viewW, 0);
  // const contentX0 = sight.xPosition * maxScrollX;
  const contentX0 = sight.xBarPosition * cellW * 16;
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
      keySpec,
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
    ],
  );
}
