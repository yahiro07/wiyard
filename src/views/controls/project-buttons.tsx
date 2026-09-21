import { cz } from "@lib/utils/cz";
import { projectsModel } from "@/project/projects-model";
import { store } from "@/store/store";
import { useRef } from "react";
import { useHandleClickOutside } from "@lib/utils/use-handle-click-outside";
import { blankScene, defaultScene } from "@/project/default-data";
import { defaultData2 } from "@/project/default-data-2";

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
        "flex-c h-30px cursor-pointer",
        "w-60px bg-#707078 rounded text-15px",
        disabled && "opacity-30 pointer-events-none",
        active && "text-#0cf",
        "hover:opacity-80",
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
  const divRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => {
    store.setSecondBarVisible(false);
  };
  useHandleClickOutside(divRef, closeMenu, {
    withPropagation: true,
    targetMethod: "click",
  });
  const withClose = (fn: () => void | Promise<void>) => {
    return () => {
      const res = fn();
      if (res instanceof Promise) {
        void res.then(() => {
          closeMenu();
        });
      } else {
        closeMenu();
      }
    };
  };
  return (
    <div
      ref={divRef}
      className={cz(
        "flex-h gap-2",
        projectLoading && "opacity-50 pointer-events-none",
      )}
    >
      <ProjectButton
        text="starter"
        onClick={withClose(() =>
          projectsModel.loadProject(defaultData2.starter),
        )}
      />
      <ProjectButton
        text="blank"
        onClick={withClose(() => projectsModel.loadProject(blankScene))}
      />
      <ProjectButton
        text="demo"
        onClick={withClose(() => projectsModel.loadProject(defaultScene))}
      />
      <ProjectButton
        text="import"
        onClick={withClose(projectsModel.importProject)}
      />
      <ProjectButton
        text="export"
        onClick={withClose(projectsModel.exportProject)}
      />
    </div>
  );
};
