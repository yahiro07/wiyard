import { createPianoRollUnit } from "@lib/piano-roll";
import { ReactUnitFrame } from "wafer-host/react";
import { appConfig } from "@/domain/app-config";
import { MidiInButtonContainer } from "@/realms/controls/midi-in-button";
import { ControlButtons } from "@/realms/desk/control-buttons";
import { DeskArea } from "@/realms/desk/desk-area";
import { UnitPickerRoot } from "@/realms/desk/unit-picker";
import { windowSystem } from "@/store/store";

const TopBar = () => {
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

const PageRootMain = () => {
  return (
    <div className="h-dvh flex-v text-white">
      <TopBar />
      <div className="grow flex-h">
        <DeskArea />
      </div>
      <UnitPickerRoot />
    </div>
  );
};

const PageRootPianoRollDev = () => {
  return (
    <div className="h-dvh flex-c">
      <ReactUnitFrame
        unitId="pianoRollDev"
        unitTemplateFn={createPianoRollUnit}
      />
    </div>
  );
};

export const PageRoot = () => {
  if (appConfig.isDevelopment && location.search.includes("unit-dev")) {
    return <PageRootPianoRollDev />;
  } else {
    return <PageRootMain />;
  }
};
