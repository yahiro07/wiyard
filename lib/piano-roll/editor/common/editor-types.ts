import { SongKeySpec } from "wafer-host/unit-types";

export type DisplaySpec = {
  viewW: number;
  viewH: number;
  cellW: number;
  cellH: number;
  contentW: number;
  contentH: number;
  tx: number;
  ty: number;
};

export type GridDisplaySpec = {
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
  numPitchesFull: number;
  keySpec?: SongKeySpec;
  wBars: number;
};

export type SectionRange = {
  offset: number;
  duration: number;
};

export type IPointerEvent = React.PointerEvent<HTMLDivElement>;
