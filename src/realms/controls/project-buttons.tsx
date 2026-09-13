import { projectsModel } from "@/project/projects-model";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const ProjectButton = ({
  text,
  children,
  onClick,
  active,
  disabled,
}: {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "flex-c h-30px cursor-pointer px-2",
        disabled && "opacity-30 pointer-events-none",
        active && "text-#0cf",
      )}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export const ProjectButtons = () => {
  const { projectLoading } = store.useSnapshot();
  return (
    <div
      className={cz(
        "flex-h",
        projectLoading && "opacity-50 pointer-events-none",
      )}
    >
      <ProjectButton text="reset" onClick={projectsModel.loadBlankProject} />
      <ProjectButton text="demo" onClick={projectsModel.loadDemoProject} />
      <ProjectButton text="import" onClick={projectsModel.importProject} />
      <ProjectButton text="export" onClick={projectsModel.exportProject} />
    </div>
  );
};
