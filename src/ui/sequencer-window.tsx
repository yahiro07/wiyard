import { actions } from "@/store/actions";
import { useSequencerWindowViewModel } from "@/store/view-models";
import { InnerWindow } from "@/ui/inner-window";
import { SequencerPanel } from "@/ui/sequencer-panel/sequencer-panel";

export const SequencerWindow = ({
  visible,
  evacuated,
}: {
  visible: boolean;
  evacuated: boolean;
}) => {
  const windowCoordVm = useSequencerWindowViewModel();
  return (
    <InnerWindow
      title="piano roll"
      windowCoordVm={windowCoordVm}
      displayed={visible}
      evacuated={evacuated}
      close={() => actions.setSequencerWindowVisible(false)}
    >
      <SequencerPanel />
    </InnerWindow>
  );
};
