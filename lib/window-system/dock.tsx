import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { actions, storeSlice } from "./store";

export const WindowDock = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="absolute-left-center z-1">
        <div
          className={cz(
            "w-60px min-h-140px m-2 flex-vc gap-2 py-6",
            // "h-55px min-w-140px m-2 flex-c gap-2 px-6",
          )}
          style={{
            background: "#fff1",
            backdropFilter: "blur(3px)",
            border: "solid 1px #fff4",
            borderRadius: "12px",
          }}
        >
          {children}
        </div>
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
        {title && (
          <div
            className={cz(
              "absolute-left-center w-auto whitespace-nowrap ml-44px py-0.5",
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
