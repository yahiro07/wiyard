import { useCallback, useEffect, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { ReactUnitFrame } from "wafer-host/react";
import { createAudioPassThroughUnit } from "./audio-pass-through";

export const HeadlessGain = ({
  unitId,
  destSpec,
  gain,
}: {
  unitId: string;
  destSpec: string;
  gain: number;
}) => {
  const [unit, setUnit] = useState<HsUnitInstance | null>(null);

  const onUnitInstanceLoaded = useCallback((unitInstance: HsUnitInstance) => {
    setUnit(unitInstance);
  }, []);

  useEffect(() => {
    const node = unit?.primaryOutputPorts.audioOutput?.node as
      | GainNode
      | undefined;
    if (!node || gain === undefined) return;
    node.gain.setValueAtTime(gain, node.context.currentTime + 0.01);
  }, [unit, gain]);

  return (
    <ReactUnitFrame
      unitTemplateFn={createAudioPassThroughUnit}
      unitId={unitId}
      destSpec={destSpec}
      onUnitInstanceLoaded={onUnitInstanceLoaded}
    />
  );
};
