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
      <ControlButtons />
      <ControlButtonsRight />
      <div className="absolute-full pointer-events-none text-lg flex-ha pl-2">
        wafer wireboard (under development)
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
