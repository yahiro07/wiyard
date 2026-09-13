import { ControlButtons } from "@/realms/controls/control-buttons";
import { MidiInButtonContainer } from "@/realms/controls/midi-in-button";
import { ProjectButtons } from "@/realms/controls/project-buttons";
import { store, windowSystem } from "@/store/store";

export const TopBar = () => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      windowSystem.toggleEvacuate();
    }
  };
  return (
    <div
      className="h-50px bg-gray-600 elative flex-ha px-2 justify-between"
      onClick={handleClick}
    >
      <div className="w-40px" />
      {/* <PickerLaunchButton /> */}
      <ControlButtons />
      <MidiInButtonContainer />
      <div className="absolute-full pointer-events-none text-lg">
        under development...
      </div>
    </div>
  );
};

export const SecondBar = () => {
  const { secondBarVisible } = store.useSnapshot();
  if (!secondBarVisible) return null;
  return (
    <div className="absolute-top-center mt-2 z-4">
      <ProjectButtons />
    </div>
  );
};
