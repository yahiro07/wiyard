import { ReactUnitTemplateFn } from "wafer-host/react";

export const createSpeakerPortUnit: ReactUnitTemplateFn = (unitInterface) => {
  unitInterface.audioInputNode.connect(unitInterface.audioInputNode);
  unitInterface.completeSetup({
    unitAspects: { unitType: "effect" },
  });
  return {
    RenderUi() {
      return null;
    },
  };
};
