import { store, windowSystem } from "@/store/store";
import {
  ControlButtons,
  ControlButtonsRight,
} from "@/views/controls/control-buttons";
import { ProjectButtons } from "@/views/controls/project-buttons";

export const TopBar = () => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      windowSystem.toggleEvacuate();
    }
  };
  return (
    <div
      className="h-50px bg-gray-600 relative flex-ha px-2 justify-between"
      onClick={handleClick}
    >
      <div className="invisible">
        <ControlButtonsRight />
      </div>
      <div className="pt-2">
        <ControlButtons />
      </div>
      <div className="pt-2">
        <ControlButtonsRight />
      </div>
      <div className="absolute-full pointer-events-none text-xl font-500 flex-ha pl-2">
        Wireboard
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
