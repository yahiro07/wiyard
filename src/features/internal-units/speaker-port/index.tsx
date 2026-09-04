import { ReactUnitTemplateFn } from "wafer-host/react";

export const createSpeakerPortUnit: ReactUnitTemplateFn = (unitInterface) => {
  unitInterface.audioInputNode.connect(unitInterface.audioOutputNode);
  unitInterface.completeSetup({
    unitAspects: { unitType: "effect" },
  });
  return {
    RenderUi() {
      return null;
    },
  };
};
