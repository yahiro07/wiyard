import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { actions, storeSlice } from "./store";

export const WindowDock = ({ children }: { children: ReactNode }) => {
  const { windowSpecs } = storeSlice.useSnapshot();
  const minimizedWindows = Object.values(windowSpecs).filter(
    (window) => window.status === "minimized",
  );
  if (minimizedWindows.length === 0) {
    return null;
  }
  return (
    <>
      <div className="absolute-left-center z-1">
        <div
          className={cz(
            "w-55px min-h-140px m-2 flex-vc gap-2 py-6",
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

export const WindowDockItem = ({
  id,
  title,
  imageUrl,
}: {
  id: string;
  title: string;
  imageUrl?: string;
}) => {
  const { windowSpecs } = storeSlice.useSnapshot();
  const windowSpec = windowSpecs[id];
  if (windowSpec?.status === "minimized") {
    return (
      <div
        className={cz(
          "w-40px h-40px rounded-8px overflow-hidden",
          "cursor-pointer hover:opacity-80",
        )}
        style={{ boxShadow: "0 0px 1px rgba(0, 0, 0, 0.6)" }}
        onClick={() => {
          actions.setWindowsEvacuated(false);
          actions.setWindowStatus(id, "visible");
          actions.setCurrentWindowId(id);
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex-c font-bold text-lg bg-#888">
            {title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    );
  }
};
