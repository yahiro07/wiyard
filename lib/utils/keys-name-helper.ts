import { SongKeySpec } from "wafer-host/unit-types";

const nameSeries = [
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

export function mapKeySpecToKeysName(keySpec: SongKeySpec) {
  return `${nameSeries[(keySpec.root + 12) % 12]}${keySpec.mode === "minor" ? "m" : ""}`;
}
