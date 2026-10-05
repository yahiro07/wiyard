export type LoopBarLength = 0.25 | 0.5 | 1 | 2 | 4 | 8 | 16;

export type Note = {
  id: number;
  pitch: number;
  position: number;
  duration: number;
  parentNoteId?: number;
};

export type SequencerEditState = {
  notes: Note[];
  octaveShift: number;
  noteDuty: number;
  loopBars: LoopBarLength;
};

export type Sight = {
  xBarPosition: number; //0~(16-wBars)
  yPosition: number; //0~1
  yZoom: number; //0~1
  wBars: number; //1~16
  withXPadding: boolean;
};

export type EditorKind = "main" | "pattern" | "mainD";

export type NoteKind = "input" | "pattern" | "mapped";

export type HoverNoteInfo = {
  noteId: number;
  part: "body" | "tail";
};

export type PatternMode = 1 | 2;
