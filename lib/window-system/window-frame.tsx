import { ReactNode } from "react";
import { cz } from "../utils/cz";
import { unitWindowHandlers } from "./handlers";
import { Icons } from "./icons";
import { actions, storeSlice } from "./store";
import { WindowStatus } from "./types";
import {
  useWindowCoordViewModel,
  WindowCoordViewModel,
} from "./window-view-models";

const ResizeAnchor = ({
  anchor,
  windowCoordVm,
}: {
  anchor: "tl" | "tr" | "bl" | "br";
  windowCoordVm: WindowCoordViewModel;
}) => {
  return (
    <div
      className={cz(
        "absolute",
        anchor === "tl" && "top-[-12px] left-[-12px] cursor-nwse-resize",
        anchor === "tr" && "top-[-12px] right-[-12px] cursor-nesw-resize",
        anchor === "bl" && "bottom-[-12px] left-[-12px] cursor-nesw-resize",
        anchor === "br" && "bottom-[-12px] right-[-12px] cursor-nwse-resize",
      )}
    >
      <div
        className="w-6 h-6"
        onPointerDown={(e) => {
          unitWindowHandlers.handleResizingAnchorPointerDown(e, windowCoordVm);
          e.stopPropagation();
        }}
      />
    </div>
  );
};

const WindowFrameView = ({
  title,
  windowCoordVm,
  children,
  evacuated,
  close,
  isCurrent,
  windowStatus,
  toggleMinimized,
}: {
  title: string;
  windowCoordVm: WindowCoordViewModel;
  children: ReactNode;
  evacuated: boolean;
  close: () => void;
  isCurrent: boolean;
  windowStatus: WindowStatus;
  toggleMinimized: () => void;
}) => {
  const { width, height } = windowCoordVm.size;
  const displayed = windowStatus === "visible";

  return (
    <>
      <div
        className={cz(
          "absolute",
          !evacuated ? "-translate-x-1/2 -translate-y-1/2" : "-translate-x-1/2",
        )}
        style={{
          left: windowCoordVm.position.x,
          top: evacuated ? "0" : windowCoordVm.position.y,
          // top: evacuated ? undefined : windowCoordVm.position.y,
          // bottom: evacuated ? "40px" : undefined,
          //windows are always exist in dom, so as to keep units working
          display: displayed ? "block" : "none",
          zIndex: isCurrent ? 1 : undefined,
        }}
      >
        <div
          className="relative"
          style={{ width }}
          onPointerDown={(e) =>
            unitWindowHandlers.handleBasePointerDown(e, windowCoordVm.windowId)
          }
        >
          <div
            className={cz(
              "flex-c cursor-pointer relative justify-end px-2",
              !evacuated && isCurrent ? "bg-#68c/96" : "bg-gray-600/70",
              !evacuated ? "h-34px" : "h-28px",
            )}
            onPointerDown={(e) =>
              unitWindowHandlers.handleTitleBarPointerDown(e, windowCoordVm)
            }
          >
            <div className={cz("flex-ha gap-2", evacuated && "hidden")}>
              <button
                type="button"
                className="cursor-pointer"
                onPointerDown={(e) => {
                  toggleMinimized?.();
                  e.stopPropagation();
                }}
              >
                <Icons.Minimize size={18} />
              </button>
              <button
                type="button"
                className="cursor-pointer"
                onPointerDown={(e) => {
                  close?.();
                  e.stopPropagation();
                }}
              >
                <Icons.Close size={24} />
              </button>
            </div>

            <div className="absolute-full flex-c pointer-events-none">
              {title}
            </div>
          </div>
          <div
            className="bg-white text-black"
            style={{
              height,
              display: evacuated ? "none" : "block",
            }}
          >
            {children}
          </div>
        </div>
        {!evacuated && (
          <>
            <ResizeAnchor anchor="tl" windowCoordVm={windowCoordVm} />
            <ResizeAnchor anchor="tr" windowCoordVm={windowCoordVm} />
            <ResizeAnchor anchor="bl" windowCoordVm={windowCoordVm} />
            <ResizeAnchor anchor="br" windowCoordVm={windowCoordVm} />
          </>
        )}
      </div>
    </>
  );
};

export const WindowFrame = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => {
  const { windowsEvacuated, currentWindowId, windowSpecs } =
    storeSlice.useSnapshot();
  const windowCoordVm = useWindowCoordViewModel(id);
  const windowSpec = windowSpecs[id];
  return (
    <WindowFrameView
      title={title}
      windowCoordVm={windowCoordVm}
      children={children}
      evacuated={windowsEvacuated}
      close={() => actions.setWindowStatus(id, "none")}
      isCurrent={currentWindowId === id}
      windowStatus={windowSpec?.status ?? "none"}
      toggleMinimized={() => actions.toggleWindowMinimized(id)}
    />
  );
};
