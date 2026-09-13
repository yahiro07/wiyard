import { createPianoRollUnit } from "@lib/piano-roll";
import { ReactUnitFrame } from "wafer-host/react";
import { appConfig } from "@/domain/app-config";
import { DeskArea } from "@/realms/desk/desk-area";
import { TopBar } from "@/realms/desk/top-control-bars";
import { UnitPickerRoot } from "@/realms/desk/unit-picker";

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
