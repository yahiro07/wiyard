import { bottomLimit, mapUnaryTo } from "@lib/utils/number-helper";
import { Size } from "../../../utils/common-types";
import { Sight } from "../../definitions/types";
import { DisplaySpec } from "./editor-types";

export function useDisplaySpec({
  sectionDuration,
  numPitches,
  sight,
  mainDivSize,
}: {
  sectionDuration: number;
  numPitches: number;
  sight: Sight;
  mainDivSize: Size | undefined;
}): DisplaySpec {
  const cellW = mapUnaryTo(sight.xZoom, 10, 60);
  const cellH = mapUnaryTo(sight.yZoom, 10, 50);

  const viewW = mainDivSize?.width ?? 100;
  const viewH = mainDivSize?.height ?? 100;
  const nx = sectionDuration;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollY = bottomLimit(contentH - viewH, 0);
  const ty = -sight.yPosition * maxScrollY;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
  const tx = -contentX0;

  return { viewW, viewH, cellW, cellH, contentW, contentH, tx, ty };
}
