import { clampValue, inBetween } from "@lib/utils/number-helper";
import { SongKeySpec } from "wafer-host/unit-types";
import { EditorKind, LoopBarLength, Note } from "../../definitions/types";
import { SectionRange } from "./editor-types";
import { uiConfig } from "../../definitions/ui-config";

type HitNoteInfo = { note: Note; part: "body" | "tail" };

export function hitTestNote(
  notes: Note[],
  sectionRange: SectionRange,
  xiFloat: number,
  yiFloat: number,
  editorKind: EditorKind,
  keySpec: SongKeySpec,
  editStride: number,
): HitNoteInfo | undefined {
  const xi = Math.floor(xiFloat);
  const isDiatonic = editorKind === "mainD";
  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    const noteYi = isDiatonic
      ? diatonicLanesPitchHelper.mapPitchToDisplayYIndex(note.pitch, keySpec)
      : note.pitch;
    const yHit = noteYi <= yiFloat && yiFloat < noteYi + 1;
    if (!yHit) continue;
    const relPos = note.position - sectionRange.offset;
    const dur = note.duration;
    const noteTailPos = relPos + dur;

    if (1) {
      const d = editStride * 0.4;
      if (
        note.duration >= editStride &&
        inBetween(xiFloat, noteTailPos - d, noteTailPos)
      ) {
        return { note, part: "tail" };
      } else if (relPos <= xi && xi < relPos + dur) {
        return { note, part: "body" };
      }
    } else if (0) {
      if (note.duration >= 2 && xi === noteTailPos - 1) {
        return { note, part: "tail" };
      } else if (relPos <= xi && xi < relPos + dur) {
        return { note, part: "body" };
      }
    } else {
      if (noteTailPos - 0.3 <= xiFloat && xiFloat <= noteTailPos + 0.3) {
        return { note, part: "tail" };
      } else if (relPos <= xi && xi < relPos + dur) {
        return { note, part: "body" };
      }
    }
  }
}

export function getPatternPitchLabel(pitch: number) {
  const pitchCenter = uiConfig.patternPitchCenter;
  return pitch - pitchCenter >= 0
    ? pitch - pitchCenter + 1
    : pitch - pitchCenter - 1;
}

const subMapD = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6];
const subMapP = [0, 2, 4, 5, 7, 9, 11];

export const diatonicLanesPitchHelper = {
  mapPitchToDisplayYIndex(pitch: number, keySpec: SongKeySpec): number {
    if (pitch < 12) {
      return this.mapPitchToDisplayYIndex(pitch + 12, keySpec) - 7;
    }
    const trChromatic = keySpec.relativeKeyTranspose;
    const trDiatonic = Math.round((keySpec.relativeKeyTranspose * 7) / 12);
    pitch -= trChromatic;
    const oct = Math.floor(pitch / 12);
    const sub = pitch % 12;
    const subD = subMapD[sub];
    return oct * 7 + subD + trDiatonic;
  },
  mapYIndexToPitch(yi: number, keySpec: SongKeySpec): number {
    if (yi < 7) {
      return this.mapYIndexToPitch(yi + 7, keySpec) - 12;
    }
    const trChromatic = keySpec.relativeKeyTranspose;
    const trDiatonic = Math.round((keySpec.relativeKeyTranspose * 7) / 12);
    yi -= trDiatonic;
    const oct = Math.floor(yi / 7);
    const sub = yi % 7;
    let subP = subMapP[sub];
    subP += trChromatic;
    return oct * 12 + subP;
  },
  checkPitchOnScale(pitch: number) {
    const sub = pitch % 12;
    return subMapP.includes(sub);
  },
  shiftPitch(
    originalPitch: number,
    deltaYi: number,
    snapToScaleNote: boolean,
    keySpec: SongKeySpec,
  ) {
    const yi =
      this.mapPitchToDisplayYIndex(originalPitch, keySpec) +
      Math.round(deltaYi);
    if (snapToScaleNote) {
      return this.mapYIndexToPitch(Math.round(yi), keySpec);
    }
    return Math.round(originalPitch + (deltaYi * 12) / 7);
  },
};

function _getLoopBarLengthForStep_0_deprecated(xiFloat: number): LoopBarLength {
  return clampValue(
    (1 << Math.ceil(Math.log2(Math.floor(xiFloat / 4) + 1))) * 0.25,
    0.25,
    16,
  ) as LoopBarLength;
}

export function getLoopBarLengthForBarPosition(pos: number): LoopBarLength {
  if (pos <= 0.25) return 0.25;
  if (pos <= 0.5) return 0.5;
  if (pos <= 1) return 1;
  if (pos <= 2) return 2;
  if (pos <= 4) return 4;
  if (pos <= 8) return 8;
  return 16;
}

export function getLoopBarLengthForStep(xiFloat: number): LoopBarLength {
  const pos = xiFloat / 16;
  return getLoopBarLengthForBarPosition(pos);
}

export function getNotesTailPositionInBars(notes: Note[]): number {
  return Math.max(0, ...notes.map((it) => it.position + it.duration)) / 16;
}

export function getInputNoteStride(wBars: number): number {
  if (wBars <= 2) return 1;
  if (wBars <= 4) return 2;
  if (wBars <= 8) return 4;
  return 8;
}
