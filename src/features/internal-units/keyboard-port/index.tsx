import { ReactUnitTemplateFn } from "wafer-host/react";

export const createKeyboardPortUnit: ReactUnitTemplateFn = (unitInterface) => {
  const noteOutputPort = unitInterface.createNoteOutputPort();

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
    },
    noteInput: {
      noteOn: noteOutputPort.noteOn,
      noteOff: noteOutputPort.noteOff,
    },
  });
  return {
    RenderUi() {
      return null;
    },
  };
};
