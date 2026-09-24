import { cz } from "@lib/utils/cz";
import { windowTitleBarHeight } from "./constants";
import { storeSlice } from "./store";
import {
  useWindowCoordViewModel,
  WindowCoordViewModel,
} from "./window-view-models";
import { windowFrameHandlers } from "./window-frame-handlers";
import { ReactNode } from "react";

const WindowFrameSideTabView = ({
  windowCoordVm,
  active,
  children,
}: {
  windowCoordVm: WindowCoordViewModel;
  active: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="absolute-left-center -ml-48px">
      <button
        className={cz(
          "w-40px h-100px flex-c pointer-events-auto cursor-pointer rounded-4px",
          "hover:opacity-90",
          active ? "bg-#68c/96" : "bg-gray-500/92",
        )}
        onPointerDown={(e0) =>
          windowFrameHandlers.handleSideTabPointerDown(e0, windowCoordVm)
        }
      >
        {children}
      </button>
    </div>
  );
};

export const WindowFrameSideTab = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const {
    windowsEvacuated: evacuated,
    currentWindowId,
    windowSpecs,
  } = storeSlice.useSnapshot();
  const windowCoordVm = useWindowCoordViewModel(id);
  const { contentSize, windowBounds } = windowCoordVm;
  const isCurrent = currentWindowId === id;
  const isActive = windowSpecs[id]?.status === "visible" && isCurrent;
  return (
    <div
      className={cz(
        "absolute pointer-events-none",
        evacuated && "hidden",
        isCurrent && "z-1",
      )}
      style={{ left: windowBounds.x, top: windowBounds.y }}
    >
      <div
        className="relative"
        style={{
          width: contentSize.width,
          height: contentSize.height + windowTitleBarHeight,
        }}
      >
        <WindowFrameSideTabView
          windowCoordVm={windowCoordVm}
          active={isActive}
          children={children}
        />
      </div>
    </div>
  );
};
