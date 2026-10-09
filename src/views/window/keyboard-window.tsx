import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { windowIds } from "@/domain/types";
import { builtinUnitIds, interUnitFactories } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";
import { commonGetters } from "@/store/common-getters";

export const KeyboardWindow = () => {
  const viewActive = commonGetters.useWindowVisible(windowIds.keyboard);
  return (
    <WindowFrame id={windowIds.keyboard} title="keyboard">
      <ScalerBoxAutoSized fitMode="cover">
        <ReactUnitFrame
          unitId={builtinUnitIds.keyboard}
          unitTemplateFn={interUnitFactories.keyboard}
          viewActive={viewActive}
        />
      </ScalerBoxAutoSized>
    </WindowFrame>
  );
};
