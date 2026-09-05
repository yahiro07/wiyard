import { useSequencerWindowViewModel } from "@/presenter/view-models";
import { actions } from "@/store/actions";
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
