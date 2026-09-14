import { createPianoRollUnit } from "@lib/piano-roll";
import { ReactUnitFrame } from "wafer-host/react";
import { appConfig } from "@/common/app-config";
import { ScreenScaler } from "@/components/screen-scaler";
import { store } from "@/store/store";
import { TopBar } from "@/views/controls/top-control-bars";
import { DeskArea } from "@/views/desk/desk-area";
import { UnitPickerRoot } from "@/views/desk/unit-picker";

const PageRootMain = () => {
  const { uiScaling } = store.useSnapshot();
  return (
    <ScreenScaler scaling={uiScaling}>
      <div className="flex-v text-white h-full">
        <TopBar />
        <div className="grow flex-h">
          <DeskArea />
        </div>
        <UnitPickerRoot />
      </div>
    </ScreenScaler>
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
