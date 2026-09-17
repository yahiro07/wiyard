import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { kKeyboardWindowId } from "@/domain/types";
import { interUnitFactories, kKeyboardUnitId } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";

export const KeyboardWindow = () => {
  return (
    <WindowFrame id={kKeyboardWindowId} title="keyboard">
      <ScalerBoxAutoSized>
        <ReactUnitFrame
          unitId={kKeyboardUnitId}
          unitTemplateFn={interUnitFactories.keyboard}
        />
      </ScalerBoxAutoSized>
    </WindowFrame>
  );
};
