import { cz } from "@lib/utils/cz";
import { Icons } from "@/common/icons";
import { Knob } from "@/components/knob";
import { NumberSlider } from "@/components/number-slider";
import { UpperLabel } from "@/components/upper-label";
import { sharedUrlSupport } from "@/project/shared-url-support";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { MidiInButtonContainer } from "@/views/controls/midi-in-button";
import { MainPlaybackButton } from "@/views/controls/playback-buttons";

export const ControlButton = ({
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
        "flex-c text-2xl w-30px h-30px cursor-pointer",
        disabled && "opacity-30 pointer-events-none",
        active && "text-#0cf",
        "hover:opacity-80",
      )}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

const _PickerLaunchButton = () => {
  const { projectLoading } = store.useSnapshot();
  return (
    <ControlButton
      disabled={projectLoading}
      onClick={actions.toggleUnitPickerVisible}
      children={<Icons.Add size={30} />}
    />
  );
};

// const _WindowEvacuationButton = () => {
//   // const { windowSpecs } = store.useSnapshot();
//   // const hasWindow = Object.values(windowSpecs).some(
//   //   (spec) => spec.status === "visible",
//   // );
//   return (
//     <ControlButton
//       onClick={windowSystem.toggleEvacuate}
//       // disabled={!hasWindow}
//       children={<Icons.Desktop />}
//     />
//   );
// };

const BpmInput = () => {
  const { bpm } = store.useSnapshot();
  return (
    <UpperLabel label="tempo">
      <NumberSlider
        value={bpm}
        min={60}
        max={180}
        step={1}
        onChange={store.setBpm}
      />
    </UpperLabel>
  );
};

const MasterVolumeInput = () => {
  const { masterVolume } = store.useSnapshot();
  return (
    <UpperLabel label="master">
      <Knob value={masterVolume} onChange={store.setMasterVolume} />
    </UpperLabel>
  );
};

const SecondBarButton = () => {
  const { loadedFromSharedUrl } = store.useSnapshot();
  if (loadedFromSharedUrl) return null;
  return (
    <ControlButton
      onClick={() => store.setSecondBarVisible(true)}
      children={<Icons.Menu size={18} />}
    />
  );
};

const SightZoomInput = () => {
  const { sight } = store.useSnapshot();
  return (
    <UpperLabel label="zoom">
      <Knob
        value={sight.eyeScaling}
        onChange={(v) => store.patchSight({ eyeScaling: v })}
        min={0.1}
        max={2}
        smaller
      />
    </UpperLabel>
  );
};

const ShareUrlButton = () => {
  const onClick = () => {
    const url = sharedUrlSupport.generateSharedUrl();
    void navigator.clipboard.writeText(url);
    alert(`shared url copied to clipboard (${url.length}bytes)`);
  };
  return (
    <ControlButton onClick={onClick} children={<Icons.Share size={26} />} />
  );
};

const GithubLinkButton = () => {
  return (
    <ControlButton
      onClick={() =>
        window.open("https://github.com/yahiro07/wireboard", "_blank")
      }
      children={<Icons.Github size={26} />}
    />
  );
};

export const ControlButtons = () => {
  return (
    <div className="flex-ha gap-5">
      <div className="invisible">
        <SecondBarButton />
      </div>
      <MainPlaybackButton />
      <BpmInput />
      <MasterVolumeInput />
      <MidiInButtonContainer />
      {/* <PickerLaunchButton /> */}
      <SecondBarButton />
      {/* <WindowEvacuationButton /> */}
    </div>
  );
};

export const ControlButtonsRight = () => {
  return (
    <div className="flex-h gap-2.5">
      <ShareUrlButton />
      <GithubLinkButton />
    </div>
  );
};

export const ControlButtonsInField = () => {
  return (
    <div className="flex-h gap-2">
      <SightZoomInput />
    </div>
  );
};
