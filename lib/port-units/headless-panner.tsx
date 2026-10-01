import { useEffect } from "react";
import { ReactUnitFrame, ReactUnitTemplateFn } from "wafer-host/react";
import { connectNodes } from "@lib/utils/audio-node-connection-helper";
import { useInstance } from "@lib/utils/hooks";

type PannerCore = {
  templateFn: ReactUnitTemplateFn;
  setVolume(volume: number): void;
  setPanning(pan: number): void;
};

function createPannerCore(): PannerCore {
  let latestVolume = 1;
  let internalSetVolume: ((volume: number) => void) | null = null;
  let latestPan = 0;
  let internalSetPanning: ((pan: number) => void) | null = null;
  return {
    templateFn(unitInterface) {
      const { audioContext, audioInputNode, audioOutputNode } = unitInterface;
      const gainNode = audioContext.createGain();
      const pannerNode = audioContext.createStereoPanner();
      const disconnects = connectNodes(
        audioInputNode,
        gainNode,
        pannerNode,
        audioOutputNode,
      );
      internalSetVolume = (volume) => {
        gainNode.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + 0.01,
        );
      };
      internalSetPanning = (pan) => {
        pannerNode.pan.linearRampToValueAtTime(
          pan,
          audioContext.currentTime + 0.01,
        );
      };
      internalSetVolume(latestVolume);
      internalSetPanning(latestPan);
      unitInterface.completeSetup({
        unitAspects: { unitType: "effect" },
        cleanup() {
          disconnects();
        },
      });
      return { RenderUi: () => null };
    },
    setVolume(volume) {
      internalSetVolume?.(volume);
      latestVolume = volume;
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
  volume,
  pan,
}: {
  unitId: string;
  destSpec?: string;
  volume: number;
  pan: number;
}) => {
  const pannerCore = useInstance(createPannerCore);

  useEffect(() => {
    pannerCore.setVolume(volume);
  }, [unitId, volume]);

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
