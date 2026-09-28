import { appEnvs } from "@/common/app-envs";
import { projectsModel } from "@/project/projects-model";
import { store } from "@/store/store";
import {
  ControlButtons,
  ControlButtonsRight,
} from "@/views/controls/control-buttons";
import { ProjectButtons } from "@/views/controls/project-buttons";

export const TopBar = () => {
  const { uiTheme } = store.useSnapshot();

  const handleClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      // windowSystem.toggleMinimizeAll();
    }
  };
  const handleTitleClick = (e: React.MouseEvent) => {
    if (appEnvs.isDevelopment) {
      projectsModel.debugDumpProjectData();
    }
    e.stopPropagation();
  };
  return (
    <div
      className="h-50px relative flex-ha px-2 justify-between"
      style={{ background: uiTheme.titleBarBg }}
      onClick={handleClick}
    >
      <div className="invisible">
        <ControlButtonsRight />
      </div>
      <div className="pt-2">
        <ControlButtons />
      </div>
      <div className="pt-0">
        <ControlButtonsRight />
      </div>
      <div className="absolute-full pointer-events-none flex-ha">
        <h1
          className="pointer-events-auto text-xl font-500 pl-2"
          onClick={handleTitleClick}
        >
          Wireboard
        </h1>
      </div>
    </div>
  );
};

export const SecondBar = () => {
  const { secondBarVisible, importedProjectFileName } = store.useSnapshot();
  if (!secondBarVisible) return null;
  return (
    <div className="absolute-top-center mt-2 z-4">
      <ProjectButtons />
      {appEnvs.isDevelopment && (
        <div className="flex justify-end text-sm">
          {importedProjectFileName}
        </div>
      )}
    </div>
  );
};
