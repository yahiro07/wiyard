import { ScreenScaler } from "@lib/components/headless/screen-scaler";
import { store } from "@/store/store";
import { DeskArea } from "@/views/desk/desk-area";
import { ErrorDialog } from "@/views/desk/error-dialog";
import { UnitPickerRoot } from "@/views/desk/unit-picker";
import { TopBar } from "@/views/controls/top-control-bars";

const ErrorDialogContainer = () => {
  const { projectLoadErrorStatus: errorStatus } = store.useSnapshot();
  if (!errorStatus) return null;
  return (
    <ErrorDialog
      message={errorStatus.message}
      closeCallback={() => {
        if (errorStatus.reloadPageWithCleanUrl) {
          location.href = "/";
        }
      }}
    />
  );
};

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
      <ErrorDialogContainer />
    </ScreenScaler>
  );
};

export const PageRoot = () => {
  return <PageRootMain />;
};
