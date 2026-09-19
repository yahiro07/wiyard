import { cz } from "@lib/utils/cz";
import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

const MidiInButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "flex-vc text-white w-40px pt-0.5 cursor-pointer",
        active ? "hover:opacity-90" : "opacity-50 hover:opacity-40",
      )}
      onClick={onClick}
    >
      <Icons.Piano size={22} />
      <div className="text-[10px] mt-[-3px]">MIDI</div>
    </button>
  );
};

export const MidiInButtonContainer = () => {
  const { midiInEnabled } = store.useSnapshot();
  if (typeof navigator.requestMIDIAccess !== "function") return;
  return (
    <MidiInButton
      active={midiInEnabled}
      onClick={actions.toggleMidiInEnabled}
    />
  );
};
