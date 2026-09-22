import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { actions, storeSlice } from "./store";
import { IconType } from "react-icons";
import { Icons } from "./icons";

const DockCleanupButton = ({
  onClick,
  icon: IConComponent,
  iconSize,
  iconAngle,
}: {
  onClick: () => void;
  icon: IconType;
  iconSize: number;
  iconAngle?: number;
}) => {
  return (
    <button
      type="button"
      className={cz("cursor-pointer p-1 hover:opacity-80")}
      style={{ transform: `rotate(${iconAngle}deg)` }}
      onClick={onClick}
    >
      <IConComponent size={iconSize} />
    </button>
  );
};

const DockCleanupButtons = () => {
  return (
    <div className="flex-ha">
      {/* <DockCleanupButton
        onClick={actions.minimizeAll}
        icon={Icons.WindowMinimize}
        iconSize={16}
        iconAngle={-90}
      /> */}
      <DockCleanupButton
        onClick={actions.closeAll}
        icon={Icons.Broom}
        iconSize={20}
      />
    </div>
  );
};

export const WindowDockMV = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={cz("w-60px min-h-140px m-2 flex-vc gap-2 py-6")}
        style={{
          background: "#fff1",
          backdropFilter: "blur(3px)",
          border: "solid 1px #fff4",
          borderRadius: "12px",
        }}
      >
        <DockCleanupButtons />
        {children}
      </div>
    </>
  );
};

export const WindowDockWH = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className={cz("flex-c gap-2")}>
        <DockCleanupButtons />
        {children}
      </div>
    </>
  );
};

export const WindowDockItemView = ({
  title,
  children,
  onClick,
}: {
  title?: string;
  children?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div className="relative group">
      <div
        className={cz(
          "w-40px h-40px rounded-8px overflow-hidden",
          "cursor-pointer hover:opacity-80",
        )}
        style={{ boxShadow: "0 0px 1px rgba(0, 0, 0, 0.6)" }}
        onClick={onClick}
      >
        {children}
        {title && false && (
          <div
            className={cz(
              "w-auto whitespace-nowrap py-0.5",
              0
                ? "absolute-left-center ml-44px"
                : "absolute-right-center mr-44px",
              "bg-#606068cc rounded-6px px-2 text-15px",
              "invisible opacity-0 group-hover:visible group-hover:opacity-100",
              "transition-opacity duration-200",
            )}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export const WindowDockItem = ({
  id,
  title,
  imageUrl,
  children,
}: {
  id: string;
  title: string;
  imageUrl?: string;
  children?: ReactNode;
}) => {
  const { windowSpecs, windowsEvacuated } = storeSlice.useSnapshot();
  const windowSpec = windowSpecs[id];
  const closed = windowSpec?.status === "none";
  const minimized = windowSpec?.status === "minimized";
  const pinned = windowSpec?.pinned;
  if (minimized || pinned) {
    return (
      <WindowDockItemView
        title={title}
        onClick={() => {
          if (pinned) {
            if (closed || minimized || windowsEvacuated) {
              actions.setWindowsEvacuated(false);
              actions.setWindowStatus(id, "visible");
              actions.setCurrentWindowId(id);
            } else {
              actions.setWindowStatus(id, "minimized");
            }
          } else {
            actions.setWindowsEvacuated(false);
            actions.setWindowStatus(id, "visible");
            actions.setCurrentWindowId(id);
          }
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        {!imageUrl && !children && (
          <div className="h-full flex-c font-bold text-lg bg-#888">
            {title.charAt(0).toUpperCase()}
          </div>
        )}
        {children}
      </WindowDockItemView>
    );
  }
};
