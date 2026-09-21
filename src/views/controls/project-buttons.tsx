import { cz } from "@lib/utils/cz";
import { projectsModel } from "@/project/projects-model";
import { store } from "@/store/store";
import { useRef } from "react";
import { useHandleClickOutside } from "@lib/utils/use-handle-click-outside";

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
        "flex-c h-32px cursor-pointer",
        "w-66px bg-#667a rounded",
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
  useHandleClickOutside(divRef, () => {
    closeMenu();
  });
  const wrapWithClose = (fn: () => void | Promise<void>) => {
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
        text="reset"
        onClick={wrapWithClose(projectsModel.loadBlankProject)}
      />
      <ProjectButton
        text="demo"
        onClick={wrapWithClose(projectsModel.loadDemoProject)}
      />
      <ProjectButton
        text="import"
        onClick={wrapWithClose(projectsModel.importProject)}
      />
      <ProjectButton
        text="export"
        onClick={wrapWithClose(projectsModel.exportProject)}
      />
    </div>
  );
};
