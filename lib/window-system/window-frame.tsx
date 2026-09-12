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
        className="absolute"
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
          style={{ width }}
          onPointerDown={(e) =>
            unitWindowHandlers.handleBasePointerDown(e, windowCoordVm.windowId)
          }
        >
          <div
            className={cz(
              "bg-gray-600/70 flex-c cursor-pointer relative justify-end px-2",
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
                  unitWindowHandlers.handleResizingAnchorPointerDown(
                    e,
                    windowCoordVm,
                  );
                  e.stopPropagation();
                }}
              >
                sz
              </button>
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
