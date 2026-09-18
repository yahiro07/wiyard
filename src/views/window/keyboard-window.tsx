import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { windowIds } from "@/domain/types";
import { builtinUnitIds, interUnitFactories } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";

export const KeyboardWindow = () => {
  return (
    <WindowFrame id={windowIds.keyboard} title="keyboard">
      <ScalerBoxAutoSized>
        <ReactUnitFrame
          unitId={builtinUnitIds.keyboard}
          unitTemplateFn={interUnitFactories.keyboard}
        />
      </ScalerBoxAutoSized>
    </WindowFrame>
  );
};
