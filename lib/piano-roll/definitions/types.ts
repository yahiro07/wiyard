export type LoopBarLength = 0.25 | 0.5 | 1 | 2 | 4 | 8 | 16;

export type Note = {
  id: number;
  pitch: number;
  position: number;
  duration: number;
};

export type SequencerEditState = {
  notes: Note[];
  octave: number;
  duty: number;
  loopBars: LoopBarLength;
};

export type Sight = {
  xPosition: number; //0~1
  yPosition: number; //0~1
  xZoom: number; //0~1
  yZoom: number; //0~1
};

// export type Sight2 = {
//   //all values are float
//   xBarPosition: number; //0~16
//   xBarDuration: number; //0~16
//   yPitchCenter: number; //0~61
//   yPitchRange: number; //0~61
// };
