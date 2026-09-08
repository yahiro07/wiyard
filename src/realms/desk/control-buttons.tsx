import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const ControlButton = ({
  text,
  children,
  onClick,
  disabled,
}: {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "flex-c text-2xl w-40px h-30px cursor-pointer",
        disabled && "opacity-30 pointer-events-none",
      )}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export const PickerLaunchButton = () => {
  return <ControlButton text="+" onClick={actions.toggleUnitPickerVisible} />;
};

export const WindowEvacuationButton = () => {
  const { currentEffectUnitId, sequencerWindowVisible } = store.useSnapshot();
  const hasWindow = currentEffectUnitId || sequencerWindowVisible;
  return (
    <ControlButton
      onClick={actions.toggleWindowsEvacuated}
      disabled={!hasWindow}
      children={<Icons.DisplayFullWidth />}
    />
  );
};

export const PlaybackButton = () => {
  return (
    <ControlButton onClick={actions.togglePlayback} children={<Icons.Play />} />
  );
};

export const ControlButtons = ({ vertical }: { vertical?: boolean }) => {
  return (
    <div className={cz(vertical ? "flex-v" : "flex-h", "gap-2")}>
      <PlaybackButton />
      <PickerLaunchButton />
      {/* <WindowEvacuationButton /> */}
    </div>
  );
};
