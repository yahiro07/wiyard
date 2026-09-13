import { Icons } from "@/common/icons";
import { NumberSlider } from "@/components/number-slider";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";
import { cz } from "@/utils/cz";

const ControlButton = ({
  text,
  children,
  onClick,
  active,
  disabled,
}: {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "flex-c text-2xl w-40px h-30px cursor-pointer",
        disabled && "opacity-30 pointer-events-none",
        active && "text-#0cf",
      )}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export const PickerLaunchButton = () => {
  return (
    <ControlButton
      onClick={actions.toggleUnitPickerVisible}
      children={<Icons.Add size={30} />}
    />
  );
};

export const WindowEvacuationButton = () => {
  // const { windowSpecs } = store.useSnapshot();
  // const hasWindow = Object.values(windowSpecs).some(
  //   (spec) => spec.status === "visible",
  // );
  return (
    <ControlButton
      onClick={windowSystem.toggleEvacuate}
      // disabled={!hasWindow}
      children={<Icons.DisplayFullWidth />}
    />
  );
};

export const PlaybackButton = () => {
  const { playing } = store.useSnapshot();
  return (
    <ControlButton
      active={playing}
      onClick={actions.togglePlayback}
      children={<Icons.Play />}
    />
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
    <div className={cz(vertical ? "flex-v" : "flex-h", "gap-4")}>
      <PlaybackButton />
      <BpmInput />
      <MasterVolumeInput />
      <PickerLaunchButton />
      {/* <WindowEvacuationButton /> */}
    </div>
  );
};
