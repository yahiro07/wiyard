import { seqNumbers } from "../utils/helpers";

const octaveStart = 2;
const octaveCount = 5;
const numKeys = octaveCount * 12 + 1;

export const uiConfig = {
  octaveStart,
  octaveCount,
  cellW: 20,
  cellH: 20,
  numKeys,
};

const subNoteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const noteNameLabels = seqNumbers(uiConfig.numKeys).map((yi) => {
  const octave = ((yi / 12) >>> 0) + 2;
  const subIndex = yi % 12;
  return `${subNoteNames[subIndex]}${octave}`;
});
