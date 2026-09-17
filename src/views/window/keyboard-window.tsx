import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { windowIds } from "@/domain/types";
import { interUnitFactories, kKeyboardUnitId } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";

export const KeyboardWindow = () => {
  return (
    <WindowFrame id={windowIds.keyboard} title="keyboard">
      <ScalerBoxAutoSized>
        <ReactUnitFrame
          unitId={kKeyboardUnitId}
          unitTemplateFn={interUnitFactories.keyboard}
        />
      </ScalerBoxAutoSized>
    </WindowFrame>
  );
};
