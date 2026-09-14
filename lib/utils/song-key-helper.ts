import { SongKeySpec } from "wafer-host/unit-types";
import { KeyName } from "../contract";

export const allKeyNames: KeyName[] = [
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
  "Cm",
  "C#m",
  "Dm",
  "D#m",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Am",
  "A#m",
  "Bm",
];

export function mapSongKeySpecToKeyName(keySpec: SongKeySpec): KeyName {
  const index =
    ((keySpec.root + 12) % 12) + (keySpec.mode === "minor" ? 12 : 0);
  return allKeyNames[index];
}

const rootMap = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: -5,
  "G#": -4,
  A: -3,
  "A#": -2,
  B: -1,
};

export function mapSongKeySpecFromKeyName(keyName: KeyName): SongKeySpec {
  const root = rootMap[keyName.replace("m", "") as keyof typeof rootMap] ?? 0;
  const mode = keyName.endsWith("m") ? "minor" : "major";
  const relativeKeyTranspose = root + (mode === "minor" ? 3 : 0);
  return { root, mode, relativeKeyTranspose };
}
