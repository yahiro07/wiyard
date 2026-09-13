import { bottomLimit } from "@lib/utils/number-helper";
import { useMemo } from "react";
import { EditorKind, LoopBarLength, Note } from "../../definitions/types";
import { useAppContext } from "../../root/app-context";
import { DisplaySpec, SectionRange } from "./editor-types";

export function useGridDisplaySpec(
  displaySpec: DisplaySpec,
  contentBars: number,
  numPitches: number,
) {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const { viewW, viewH, cellW, cellH } = displaySpec;

  const nx = contentBars * 16;
  const contentW = cellW * nx;
  const contentH = cellH * numPitches;

  const maxScrollX = bottomLimit(contentW - viewW, 0);
  const contentX0 = sight.xPosition * maxScrollX;
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
    ],
  );
}

export function getSectionStride(loopBars: LoopBarLength, _pageIndex: number) {
  if (loopBars < 2) {
    const nx = 2 / loopBars;
    const sectionStride = 32 / nx;
    return { nx, sectionOffset: 0, sectionStride };
  } else {
    const nx = 1;
    // const sectionStride = 32;
    // const sectionOffset = pageIndex * sectionStride;
    const sectionOffset = 0;
    const sectionStride = loopBars * 16;
    return { nx, sectionOffset, sectionStride };
  }
}

type HitNoteInfo = { note: Note; part: "body" | "tail" };

export function hitTestNote(
  notes: Note[],
  sectionRange: SectionRange,
  xiFloat: number,
  yiFloat: number,
  editorKind: EditorKind,
): HitNoteInfo | undefined {
  const xi = Math.floor(xiFloat);
  const isDiatonic = editorKind === "mainD";
  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    const noteYi = isDiatonic
      ? diatonicLanesPitchHelper.mapPitchToDisplayYIndex(note.pitch)
      : note.pitch;
    const yHit = noteYi <= yiFloat && yiFloat < noteYi + 1;
    if (!yHit) continue;
    const relPos = note.position - sectionRange.offset;
    const dur = note.duration;
    const noteTailPos = relPos + dur;
    if (note.duration >= 2 && xi === noteTailPos - 1) {
      return { note, part: "tail" };
    } else if (relPos <= xi && xi < relPos + dur) {
      return { note, part: "body" };
    }
  }
}

export function getPatternPitchLabel(pitch: number) {
  return pitch - 7 >= 0 ? pitch - 7 + 1 : pitch - 7 - 1;
}

const subMapD = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const subMapP = [0, 2, 4, 5, 7, 9, 11];

export const diatonicLanesPitchHelper = {
  mapPitchToDisplayYIndex(pitch: number) {
    const oct = Math.floor(pitch / 12);
    const sub = pitch % 12;
    return oct * 7 + subMapD[sub];
  },
  mapYIndexToPitch(yi: number) {
    const oct = Math.floor(yi / 7);
    const sub = yi % 7;
    return oct * 12 + subMapP[sub];
  },
  checkPitchOnScale(pitch: number) {
    const sub = pitch % 12;
    return subMapP.includes(sub);
  },
  shiftPitch(originalPitch: number, deltaYi: number, snapToScaleNote: boolean) {
    const yi =
      this.mapPitchToDisplayYIndex(originalPitch) + Math.round(deltaYi);
    if (snapToScaleNote) {
      return this.mapYIndexToPitch(Math.round(yi));
    }
    return Math.round(originalPitch + (deltaYi * 12) / 7);
  },
};
