import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { ControlButton } from "@/views/controls/control-buttons";
import { windowTitleBarControlComponents } from "@/views/window/components/window-title-bar-controls";

export const MainPlaybackButton = () => {
  const { playing, projectLoading, soloPlaybackUnitId } = store.useSnapshot();
  return (
    <ControlButton
      active={playing}
      disabled={projectLoading || soloPlaybackUnitId !== null}
      onClick={actions.togglePlayback}
      children={<Icons.Play />}
    />
  );
};

export const UnitWindowTitleBarPlaybackButtonContainer = ({
  unitId,
}: {
  unitId: string;
}) => {
  const { soloPlaybackUnitId, projectLoading, playing, soloModeUnitId } =
    store.useSnapshot();
  if (!playing) {
    return (
      <windowTitleBarControlComponents.SoloPlaybackButton
        active={unitId === soloPlaybackUnitId}
        disabled={
          projectLoading ||
          playing ||
          (soloPlaybackUnitId !== null && soloPlaybackUnitId !== unitId)
        }
        onClick={() => {
          actions.toggleSoloPlayback(unitId);
        }}
      />
    );
  } else {
    return (
      <windowTitleBarControlComponents.SoloButton
        active={unitId === soloModeUnitId}
        onClick={() => {
          actions.toggleSoloModeUnit(unitId);
        }}
      />
    );
  }
};
