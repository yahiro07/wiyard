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
import { IconType } from "react-icons";
import { renderLog } from "@lib/utils/render-log";

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
          "bg-gray-500/50 rounded-6px",
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

const WindowControlButton = ({
  onClick,
  icon: IConComponent,
  iconSize,
}: {
  onClick: () => void;
  icon: IconType;
  iconSize: number;
}) => {
  return (
    <button
      type="button"
      className={cz("cursor-pointer w-28px h-36px flex-c")}
      onClick={onClick}
    >
      <div className={cz("w-16px h-16px rounded-full bg-white/50 flex-c")}>
        <IConComponent size={iconSize} />
      </div>
    </button>
  );
};

const TopBar = ({
  windowCoordVm,
  title,
  isCurrent,
  closeWindow,
  toggleMinimized,
  topBarInnerControls,
  topBarInnerControls2,
}: {
  windowCoordVm: WindowCoordViewModel;
  title: string;
  isCurrent: boolean;
  closeWindow: () => void;
  toggleMinimized: () => void;
  topBarInnerControls?: ReactNode;
  topBarInnerControls2?: ReactNode;
}) => {
  return (
    // <div className="absolute w-full" style={{ top: -windowTitleBarHeight }}>
    <div
      className={cz(
        "flex-c relative justify-between",
        isCurrent ? "bg-#68c/96" : "bg-gray-500/92",
      )}
      style={{ height: windowTitleBarHeight }}
    >
      <div
        className={cz(
          "flex-ha pl-1",
          "[&>button>div>svg]:(opacity-0)",
          "[&:hover>button>div>svg]:(opacity-100)",
        )}
      >
        <WindowControlButton
          onClick={closeWindow}
          icon={Icons.Close}
          iconSize={14}
        />
        <WindowControlButton
          onClick={toggleMinimized}
          icon={Icons.Minus}
          iconSize={14}
        />
      </div>
      {topBarInnerControls && (
        <div className="flex-ha gap-2 pl-1.5">{topBarInnerControls}</div>
      )}
      <div
        className="grow h-full"
        onPointerDown={(e) =>
          windowFrameHandlers.handleTitleBarPointerDown(e, windowCoordVm)
        }
      />
      {topBarInnerControls2 && (
        <div className="pr-2">{topBarInnerControls2}</div>
      )}

      <div className="absolute-full flex-c pointer-events-none font-500">
        {title}
      </div>
    </div>
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
  topBarInnerControls2,
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
  topBarInnerControls2?: ReactNode;
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
          className={cz(
            "relative bd-gray-500/40",
            "rounded-6px overflow-hidden",
            isCurrent && "!bd-#68c/50",
          )}
          style={{ width: windowBounds.width, height: windowBounds.height }}
          onPointerDown={(e) =>
            windowFrameHandlers.handleBasePointerDown(e, windowCoordVm.windowId)
          }
        >
          {displayed && (
            <TopBar
              windowCoordVm={windowCoordVm}
              title={title}
              isCurrent={isCurrent}
              closeWindow={closeWindow}
              toggleMinimized={toggleMinimized}
              topBarInnerControls={topBarInnerControls}
              topBarInnerControls2={topBarInnerControls2}
            />
          )}
          <div
            className="bg-white text-black h-full"
            style={{
              width: contentSize.width - 2,
              height: contentSize.height - 2,
            }}
          >
            {children}
          </div>
          {displayed && (
            <>
              <ResizeAnchor anchor="tl" windowCoordVm={windowCoordVm} />
              <ResizeAnchor anchor="tr" windowCoordVm={windowCoordVm} />
              <ResizeAnchor anchor="bl" windowCoordVm={windowCoordVm} />
              <ResizeAnchor anchor="br" windowCoordVm={windowCoordVm} />
            </>
          )}
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
  topBarInnerControls2,
}: {
  id: string;
  title: string;
  children: ReactNode;
  topBarInnerControls?: ReactNode;
  topBarInnerControls2?: ReactNode;
}) => {
  const { windowsEvacuated, currentWindowId, windowSpecs } =
    storeSlice.useSnapshot();
  const windowCoordVm = useWindowCoordViewModel(id);
  const windowSpec = windowSpecs[id];

  renderLog("WindowFrame", id);

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
      topBarInnerControls2={topBarInnerControls2}
    />
  );
};
