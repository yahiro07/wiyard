export type WaferExNotesVisualizer = {
  MessageFromHost: {
    type: "note";
    ch: number;
    isOn: boolean;
    noteNumber: number;
  };
};
