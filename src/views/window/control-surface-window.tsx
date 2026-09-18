import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { windowIds } from "@/domain/types";
import { builtinUnitIds, interUnitFactories } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";
import { useUnitStuffReporter } from "@/views/window/unit-stuff-reporter";
import { useLayoutEffect } from "react";

export const ControlSurfaceWindow = () => {
  const reporter = useUnitStuffReporter(builtinUnitIds.controlSurface);
  useLayoutEffect(reporter.reportLoadStart, []);

  return (
    <WindowFrame id={windowIds.controlSurface} title="control surface">
      <ScalerBoxAutoSized>
        <ReactUnitFrame
          unitId={builtinUnitIds.controlSurface}
          unitTemplateFn={interUnitFactories.controlSurface}
          onUnitInstanceLoaded={reporter.reportLoaded}
        />
      </ScalerBoxAutoSized>
    </WindowFrame>
  );
};
