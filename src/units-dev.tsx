import { createKeyboardUnit } from "@lib/keyboard";
import { createPianoRollUnit } from "@lib/piano-roll";
import { HostAppProvider, ReactUnitFrame } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";

const PageRootUnitsDev = () => {
  return (
    <div className="h-dvh flex-c">
      {false && (
        <ReactUnitFrame
          unitId="pianoRollDev"
          unitTemplateFn={createPianoRollUnit}
        />
      )}
      {true && (
        <ReactUnitFrame
          unitId="keyboardDev"
          unitTemplateFn={createKeyboardUnit}
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
