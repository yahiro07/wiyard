import { kSequencerWindowId } from "@/domain/types";
import { useWindowCoordViewModel } from "@/presenter/window-view-models";
import { InnerWindow } from "@/realms/desk/inner-window";
import { SequencerPanel } from "@/realms/sequencer/sequencer-panel";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const SequencerWindow = () => {
  const { windowsEvacuated, currentWindowId, windowSpecs } =
    store.useSnapshot();
  const windowCoordVm = useWindowCoordViewModel(kSequencerWindowId);
  const windowSpec = windowSpecs[kSequencerWindowId];
  return (
    <InnerWindow
      title="piano roll"
      windowCoordVm={windowCoordVm}
      windowStatus={windowSpec?.status ?? "none"}
      evacuated={windowsEvacuated}
      close={() => actions.setWindowStatus(kSequencerWindowId, "none")}
      isCurrent={currentWindowId === kSequencerWindowId}
      toggleMinimized={() => actions.toggleWindowMinimized(kSequencerWindowId)}
    >
      <SequencerPanel />
    </InnerWindow>
  );
};
