import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { windowIds } from "@/domain/types";
import { builtinUnitIds, interUnitFactories } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";

export const ControlSurfaceWindow = () => {
  return (
    <WindowFrame id={windowIds.controlSurface} title="control surface">
      <ScalerBoxAutoSized>
        <ReactUnitFrame
          unitId={builtinUnitIds.controlSurface}
          unitTemplateFn={interUnitFactories.controlSurface}
        />
      </ScalerBoxAutoSized>
    </WindowFrame>
  );
};
