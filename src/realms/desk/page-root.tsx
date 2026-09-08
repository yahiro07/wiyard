import { MidiInButtonContainer } from "@/realms/controls/midi-in-button";
import { ControlButtons } from "@/realms/desk/control-buttons";
import { DeskArea } from "@/realms/desk/desk-area";
import { UnitPickerRoot } from "@/realms/desk/unit-picker";
import { actions } from "@/store/actions";

const TopBar = () => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      actions.toggleWindowsEvacuated();
    }
  };
  return (
    <div
      className="h-50px bg-gray-600 elative flex-ha px-2 justify-between"
      onClick={handleClick}
    >
      <div />
      {/* <PickerLaunchButton /> */}
      <ControlButtons />
      <MidiInButtonContainer />
      <div className="absolute-full pointer-events-none text-lg">
        under development...
      </div>
    </div>
  );
};
const BottomBar = () => {
  return <div className="h-25px bg-gray-600 flex-c text-lg px-2"></div>;
};

const InnerBottomBar = () => {
  return (
    <div className="absolute-bottom-center">
      <div className="w-400px h-50px bg-gray-600/50 flex-c text-lg px-2">
        <ControlButtons />
      </div>
    </div>
  );
};

export const PageRoot = () => {
  return (
    <div className="h-dvh flex-v text-white">
      <TopBar />
      <div className="grow flex-h">
        <DeskArea
        // additionalContents={
        //   <>
        //     <InnerBottomBar />
        //   </>
        // }
        />
      </div>
      {/* <BottomBar /> */}
      <UnitPickerRoot />
    </div>
  );
};
