import { useSequencerWindowViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { SequencerPanel } from "@/realms/sequencer/sequencer-panel";
import { actions } from "@/store/actions";

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
