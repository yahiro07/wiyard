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
  displaySpec: ds,
}: {
  displaySpec: PianoRollGridDisplaySpec;
}) => {
  return (
    <div
      className="flex-c bd-green"
      style={{ width: ds.viewW, height: ds.viewH }}
    >
      new grid impl
    </div>
  );
};
