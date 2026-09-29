import { createKeyboardUnit } from "@lib/keyboard";
import { createPianoRollUnit } from "@lib/piano-roll";
import { HostAppProvider, ReactUnitFrame } from "wafer-host/react";
import { createAutomationEditorUnit } from "@lib/automation-editor";
import { createControlSurfaceUnit } from "@lib/control-surface";
import { createHostSystem } from "wafer-host/core";

const hostSystem = createHostSystem();

const PageRootUnitsDev = () => {
  return (
    <div className="h-dvh flex-c">
      {true && (
        <ReactUnitFrame
          unitId="pianoRollDev"
          unitTemplateFn={createPianoRollUnit}
        />
      )}
      {false && (
        <ReactUnitFrame
          unitId="keyboardDev"
          unitTemplateFn={createKeyboardUnit}
        />
      )}
      {false && (
        <ReactUnitFrame
          unitId="automationEditorDev"
          unitTemplateFn={createAutomationEditorUnit}
        />
      )}
      {false && (
        <ReactUnitFrame
          unitId="controlSurfaceDev"
          unitTemplateFn={createControlSurfaceUnit}
        />
      )}
    </div>
  );
};

export const AppUnitsDev = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <PageRootUnitsDev />
    </HostAppProvider>
  );
};
