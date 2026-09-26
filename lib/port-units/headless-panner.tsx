import { useEffect } from "react";
import { ReactUnitFrame, ReactUnitTemplateFn } from "wafer-host/react";
import {
  connectNodes,
  disconnectNodes,
} from "@lib/utils/audio-node-connection-helper";
import { useInstance } from "@lib/utils/hooks";

type PannerCore = {
  templateFn: ReactUnitTemplateFn;
  setPanning(pan: number): void;
};

function createPannerCore(): PannerCore {
  let latestPan = 0;
  let internalSetPanning: ((pan: number) => void) | null = null;
  return {
    templateFn(unitInterface) {
      const { audioContext, audioInputNode, audioOutputNode } = unitInterface;
      const pannerNode = audioContext.createStereoPanner();
      connectNodes(audioInputNode, pannerNode, audioOutputNode);
      internalSetPanning = (pan) => {
        pannerNode.pan.linearRampToValueAtTime(
          pan,
          audioContext.currentTime + 0.01,
        );
      };
      internalSetPanning(latestPan);
      unitInterface.completeSetup({
        unitAspects: { unitType: "effect" },
        cleanup() {
          disconnectNodes(audioInputNode, pannerNode, audioOutputNode);
        },
      });
      return { RenderUi: () => null };
    },
    setPanning(pan) {
      internalSetPanning?.(pan);
      latestPan = pan;
    },
  };
}

export const HeadlessPanner = ({
  unitId,
  destSpec,
  pan,
}: {
  unitId: string;
  destSpec: string;
  pan: number;
}) => {
  const pannerCore = useInstance(createPannerCore);
  useEffect(() => {
    pannerCore.setPanning(pan);
  }, [unitId, pan]);

  return (
    <ReactUnitFrame
      unitTemplateFn={pannerCore.templateFn}
      unitId={unitId}
      destSpec={destSpec}
    />
  );
};
