import { cz } from "@lib/utils/cz";
import { Icons } from "@/common/icons";
import { NumberSlider } from "@/components/number-slider";
import { MidiInButtonContainer } from "@/realms/controls/midi-in-button";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";

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
  const { projectLoading } = store.useSnapshot();
  return (
    <ControlButton
      disabled={projectLoading}
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
  const { playing, projectLoading } = store.useSnapshot();
  return (
    <ControlButton
      active={playing}
      disabled={projectLoading}
      onClick={actions.togglePlayback}
      children={<Icons.Play />}
    />
  );
};

export const BpmInput = () => {
  const { bpm } = store.useSnapshot();
  return (
    <NumberSlider
      label="tempo"
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

export const SecondBarButton = () => {
  return (
    <ControlButton
      onClick={store.toggleSecondBarVisible}
      children={<Icons.Menu size={18} />}
    />
  );
};

export const SightZoomInput = () => {
  const { sight } = store.useSnapshot();
  return (
    <NumberSlider
      label="zoom"
      value={sight.eyeScaling}
      onChange={(v) => store.patchSight({ eyeScaling: v })}
      min={0.1}
      max={2}
      step={0.01}
      fracDigits={2}
    />
  );
};

export const ControlButtons = ({ vertical }: { vertical?: boolean }) => {
  return (
    <div className={cz(vertical ? "flex-v" : "flex-h", "gap-4")}>
      <div className="invisible">
        <SecondBarButton />
      </div>
      <PlaybackButton />
      <BpmInput />
      <MasterVolumeInput />
      <MidiInButtonContainer />
      <PickerLaunchButton />
      <SecondBarButton />
      {/* <WindowEvacuationButton /> */}
    </div>
  );
};

export const ControlButtonsRight = () => {
  return (
    <div className="flex-h gap-2">
      <SightZoomInput />
    </div>
  );
};
