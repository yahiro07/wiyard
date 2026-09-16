import { ReactUnitTemplateFn } from "wafer-host/react";

export const createAutomationEditorUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
  });
  return {
    RenderUi() {
      return <div>hello</div>;
    },
  };
};
