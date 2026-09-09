import { useSequencerWindowViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { SequencerPanel } from "@/realms/sequencer/sequencer-panel";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const SequencerWindow = () => {
  const { windowsEvacuated, sequencerWindowStatus, currentWindowUnitId } =
    store.useSnapshot();
  const windowCoordVm = useSequencerWindowViewModel();
  return (
    <InnerWindow
      title="piano roll"
      windowCoordVm={windowCoordVm}
      windowStatus={sequencerWindowStatus}
      evacuated={windowsEvacuated}
      close={() => actions.setSequencerWindowStatus("none")}
      isCurrent={currentWindowUnitId === "sequencerWindow"}
      toggleMinimized={() => actions.toggleSequencerWindowMinimized()}
    >
      <SequencerPanel />
    </InnerWindow>
  );
};
