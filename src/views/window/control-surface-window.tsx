import { ScalerBoxAutoSized } from "@lib/components/headless/scaler-box-auto-sized";
import { windowIds } from "@/domain/types";
import { builtinUnitIds, interUnitFactories } from "@/domain/unit-entries";
import { WindowFrame } from "@lib/window-system";
import { ReactUnitFrame } from "wafer-host/react";
import { useUnitStuffReporter } from "@/views/window/unit-stuff-reporter";
import { useEffect, useLayoutEffect } from "react";
import { useUnitStuff } from "@/views/unit-card/unit-cards-common";
import { store } from "@/store/store";
import { actions } from "@/store/actions";

export const ControlSurfaceWindow = () => {
  const unitId = builtinUnitIds.controlSurface;
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  const unitStuff = useUnitStuff(unitId);
  useEffect(() => {
    const viewSize = unitStuff?.viewSize;
    const windowSpec = store.state.windowSpecs[windowIds.controlSurface];
    const currentSize = windowSpec?.contentSize;
    if (currentSize && viewSize) {
      actions.setWindowContentSize(windowIds.controlSurface, viewSize);
    }
  }, [unitStuff]);

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
