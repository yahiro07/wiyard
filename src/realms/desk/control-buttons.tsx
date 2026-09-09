import { Icons } from "@/common/icons";
import { NumberSlider } from "@/components/number-slider";
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

export const BpmInput = () => {
  const { bpm } = store.useSnapshot();
  return (
    <NumberSlider
      label="BPM"
      value={bpm}
      min={60}
      max={180}
      step={1}
      onChange={store.setBpm}
    />
  );
};

export const MasterVolumeInput = () => {
  const { masterVolume } = store.useSnapshot();
  return (
    <NumberSlider
      label="master"
      value={masterVolume}
      onChange={store.setMasterVolume}
      max={1}
      step={0.01}
      fracDigits={2}
    />
  );
};

export const ControlButtons = ({ vertical }: { vertical?: boolean }) => {
  return (
    <div className={cz(vertical ? "flex-v" : "flex-h", "gap-2")}>
      <PlaybackButton />
      <BpmInput />
      <MasterVolumeInput />
      <PickerLaunchButton />
      {/* <WindowEvacuationButton /> */}
    </div>
  );
};
