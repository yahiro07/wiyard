import { ReactUnitTemplateFn } from "wafer-host/react";

export const createAudioPassThroughUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  unitInterface.audioInputNode.connect(unitInterface.audioOutputNode);
  unitInterface.completeSetup({
    unitAspects: { unitType: "effect" },
    cleanup() {
      unitInterface.audioInputNode.disconnect();
    },
  });
  return {
    RenderUi() {
      return null;
    },
  };
};
