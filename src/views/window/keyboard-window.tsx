import { kKeyboardWindowId } from "@/domain/types";
import { internalUnitSpecs, kKeyboardUnitId } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";

export const KeyboardWindow = () => {
  return (
    <WindowFrame id={kKeyboardWindowId} title="keyboard">
      <ReactUnitFrame
        unitId={kKeyboardUnitId}
        unitTemplateFn={internalUnitSpecs.keyboard.factory}
      />
    </WindowFrame>
  );
};
