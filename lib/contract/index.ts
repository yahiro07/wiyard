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

export type MessageToUnit =
  | {
      type: "controlChange";
      controlNumber: number;
      value: number; //0~127
    }
  | {
      type: "setDestinationParameterPaths";
      destinationParameterPaths: Record<string, string[]>;
    }
  | {
      type: "emitSessionState";
      //returning Record<string, any>;
    }
  | {
      type: "applySessionState";
      state: Record<string, any>;
    };
