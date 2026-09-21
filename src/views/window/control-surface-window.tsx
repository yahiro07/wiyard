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
import { decodeWireConnectionKey } from "@/domain/port-helpers";
import { hostSystem } from "@/domain/host-system-instance";
import { MessageToUnit } from "@lib/contract";
import { sizeOp } from "@lib/utils/geometry-helper";

const controlSurfaceHooks = {
  useAffectViewSizeChange() {
    const unitStuff = useUnitStuff(builtinUnitIds.controlSurface);
    useEffect(() => {
      const viewSize = unitStuff?.viewSize;
      const windowSpec = store.state.windowSpecs[windowIds.controlSurface];
      const currentSize = windowSpec?.contentSize;
      if (currentSize && viewSize) {
        const modSize = sizeOp.rounded(sizeOp.scale(viewSize, 0.8));
        actions.setWindowContentSize(windowIds.controlSurface, modSize);
      }
    }, [unitStuff]);
  },
  useReportDestinationParameterPaths() {
    const { wireConnectionKeys, wireAutomationParameterIds } =
      store.useSnapshot();
    useEffect(() => {
      const csUnitId = builtinUnitIds.controlSurface;
      const targetConnectionKeys = wireConnectionKeys.filter((key) =>
        key.startsWith(csUnitId),
      );
      let paths: Record<string, string[]> = {};
      for (const connectionKey of targetConnectionKeys) {
        const { sourcePortId, destinationUnitId } =
          decodeWireConnectionKey(connectionKey);
        const destParameterId = wireAutomationParameterIds[connectionKey];
        if (destParameterId) {
          paths[sourcePortId] ??= [];
          paths[sourcePortId].push(
            `${destinationUnitId.replace("_", "-")}.${destParameterId}`,
          );
        }
      }
      const message: MessageToUnit = {
        type: "setDestinationParameterPaths",
        destinationParameterPaths: paths,
      };
      hostSystem.sendMessageToUnit(csUnitId, message);
    }, [wireConnectionKeys, wireAutomationParameterIds]);
  },
};

export const ControlSurfaceWindow = () => {
  const unitId = builtinUnitIds.controlSurface;
  const reporter = useUnitStuffReporter(unitId);
  useLayoutEffect(reporter.reportLoadStart, []);
  controlSurfaceHooks.useAffectViewSizeChange();
  controlSurfaceHooks.useReportDestinationParameterPaths();

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
