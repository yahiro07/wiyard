export type KeyName =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B"
  | "Cm"
  | "C#m"
  | "Dm"
  | "D#m"
  | "Em"
  | "Fm"
  | "F#m"
  | "Gm"
  | "G#m"
  | "Am"
  | "A#m"
  | "Bm";

export type MessageFromUnit =
  | { type: "setKeyName"; keyName: KeyName }
  | {
      type: "setAutomationOutputPortsOptInFlags";
      flags: Record<string, boolean>;
    };
