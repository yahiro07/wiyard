import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { windowTitleBarHeight } from "./constants";
import { Icons } from "./icons";
import { actions, storeSlice } from "./store";
import { WindowStatus } from "./types";
import { windowFrameHandlers } from "./window-frame-handlers";
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
        "absolute rounded-full",
        anchor === "tl" && "top-[-12px] left-[-12px] cursor-nwse-resize",
        anchor === "tr" && "top-[-12px] right-[-12px] cursor-nesw-resize",
        anchor === "bl" && "bottom-[-12px] left-[-12px] cursor-nesw-resize",
        anchor === "br" && "bottom-[-12px] right-[-12px] cursor-nwse-resize",
      )}
    >
      <div
        className="w-6 h-6"
        onPointerDown={(e) => {
          windowFrameHandlers.handleResizingAnchorPointerDown(
            e,
            windowCoordVm,
            anchor,
          );
          e.stopPropagation();
        }}
      />
    </div>
  );
};

const EvacuatedBar = ({
  windowCoordVm,
  title,
  isCurrent,
}: {
  windowCoordVm: WindowCoordViewModel;
  title: string;
  isCurrent: boolean;
}) => {
  return (
    <div
      className={cz("absolute", "-translate-x-1/2")}
      style={{
        left: windowCoordVm.position.x,
        top: 0,
        zIndex: isCurrent ? 1 : undefined,
      }}
    >
      <div
        className={cz(
          "flex-c cursor-pointer relative justify-end px-2",
          "bg-gray-600/70",
          "h-28px",
        )}
        style={{ width: windowCoordVm.windowBounds.width }}
        onPointerDown={(e) =>
          windowFrameHandlers.handleTitleBarPointerDown(e, windowCoordVm)
        }
      >
        <div className="absolute-full flex-c pointer-events-none">{title}</div>
      </div>
    </div>
  );
};

const TopBar = ({
  windowCoordVm,
  title,
  isCurrent,
  closeWindow,
  toggleMinimized,
  topBarInnerControls,
}: {
  windowCoordVm: WindowCoordViewModel;
  title: string;
  isCurrent: boolean;
  closeWindow: () => void;
  toggleMinimized: () => void;
  topBarInnerControls?: ReactNode;
}) => {
  return (
    // <div className="absolute w-full" style={{ top: -windowTitleBarHeight }}>
    <div
      className={cz(
        "flex-c relative justify-between px-2",
        isCurrent ? "bg-#68c/96" : "bg-gray-600/92",
      )}
      style={{ height: windowTitleBarHeight }}
      onPointerDown={(e) =>
        windowFrameHandlers.handleTitleBarPointerDown(e, windowCoordVm)
      }
    >
      {topBarInnerControls ?? <div />}
      <div className={cz("flex-ha gap-2")}>
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
            closeWindow();
            e.stopPropagation();
          }}
        >
          <Icons.Close size={24} />
        </button>
      </div>

      <div className="absolute-full flex-c pointer-events-none font-500">
        {title}
      </div>
    </div>
    // </div>
  );
};

const WindowFrameView = ({
  title,
  windowCoordVm,
  children,
  evacuated,
  closeWindow,
  isCurrent,
  windowStatus,
  toggleMinimized,
  topBarInnerControls,
}: {
  title: string;
  windowCoordVm: WindowCoordViewModel;
  children: ReactNode;
  evacuated: boolean;
  closeWindow: () => void;
  isCurrent: boolean;
  windowStatus: WindowStatus;
  toggleMinimized: () => void;
  topBarInnerControls?: ReactNode;
}) => {
  const { contentSize, windowBounds } = windowCoordVm;
  const displayed = !evacuated && windowStatus === "visible";
  const evacuatedBarVisible = evacuated && windowStatus === "visible";

  return (
    <>
      {evacuatedBarVisible && (
        <EvacuatedBar
          windowCoordVm={windowCoordVm}
          title={title}
          isCurrent={isCurrent}
        />
      )}
      <div
        className="absolute"
        style={{
          left: windowBounds.x,
          top: windowBounds.y,
          //windows are always exist in dom, so as to keep units working
          display: displayed ? "block" : "none",
          zIndex: isCurrent ? 1 : undefined,
        }}
      >
        <div
          className="relative"
          style={{ width: windowBounds.width, height: windowBounds.height }}
          onPointerDown={(e) =>
            windowFrameHandlers.handleBasePointerDown(e, windowCoordVm.windowId)
          }
        >
          <TopBar
            windowCoordVm={windowCoordVm}
            title={title}
            isCurrent={isCurrent}
            closeWindow={closeWindow}
            toggleMinimized={toggleMinimized}
            topBarInnerControls={topBarInnerControls}
          />
          <div
            className="bg-white text-black h-full"
            style={{ width: contentSize.width, height: contentSize.height }}
          >
            {children}
          </div>
          <>
            <ResizeAnchor anchor="tl" windowCoordVm={windowCoordVm} />
            <ResizeAnchor anchor="tr" windowCoordVm={windowCoordVm} />
            <ResizeAnchor anchor="bl" windowCoordVm={windowCoordVm} />
            <ResizeAnchor anchor="br" windowCoordVm={windowCoordVm} />
          </>
        </div>
      </div>
    </>
  );
};
export const WindowFrame = ({
  id,
  title,
  children,
  topBarInnerControls,
}: {
  id: string;
  title: string;
  children: ReactNode;
  topBarInnerControls?: ReactNode;
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
      closeWindow={() => actions.setWindowStatus(id, "none")}
      isCurrent={currentWindowId === id}
      windowStatus={windowSpec?.status ?? "none"}
      toggleMinimized={() => actions.toggleWindowMinimized(id)}
      topBarInnerControls={topBarInnerControls}
    />
  );
};
