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

export function getNoteNameLabel(yi: number, octaveShift: number) {
  const octave = Math.floor(yi / 12) + 1 + octaveShift;
  const subIndex = (yi + 12) % 12;
  return `${subNoteNames[subIndex]}${octave}`;
}
