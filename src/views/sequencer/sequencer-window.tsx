import { WindowFrame } from "@lib/window-system";
import { kSequencerWindowId } from "@/domain/types";
import { SequencerPanel } from "@/views/sequencer/sequencer-panel";

export const SequencerWindow = () => {
  return (
    <WindowFrame id={kSequencerWindowId} title="piano roll">
      <SequencerPanel />
    </WindowFrame>
  );
};
