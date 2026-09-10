export type PianoRollGridDisplaySpec = {
  contentW: number;
  contentH: number;
  viewW: number;
  viewH: number;
  contentX0: number;
  contentX1: number;
  contentY0: number;
  contentY1: number;
  cellW: number;
  cellH: number;
  numStepsFull: number;
  numKeysFull: number;
};

export const PianoRollGrid = ({
  displaySpec,
}: {
  displaySpec: PianoRollGridDisplaySpec;
}) => {
  return <div></div>;
};
