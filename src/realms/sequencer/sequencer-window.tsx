import { useSequencerWindowViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { SequencerPanel } from "@/realms/sequencer/sequencer-panel";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const SequencerWindow = () => {
  const { windowsEvacuated, sequencerWindowVisible, currentWindowUnitId } =
    store.useSnapshot();
  const windowCoordVm = useSequencerWindowViewModel();
  return (
    <InnerWindow
      title="piano roll"
      windowCoordVm={windowCoordVm}
      windowStatus={sequencerWindowVisible ? "visible" : "none"}
      evacuated={windowsEvacuated}
      close={() => actions.setSequencerWindowVisible(false)}
      isCurrent={currentWindowUnitId === "sequencerWindow"}
      toggleMinimized={() => {}}
    >
      <SequencerPanel />
    </InnerWindow>
  );
};
