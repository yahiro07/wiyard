import { ReactUnitTemplateFn } from "wafer-host/react";

export const createPianoRollUnit: ReactUnitTemplateFn = (unitInterface) => {
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
  });
  return {
    RenderUi() {
      return <div>piano roll</div>;
    },
  };
};
