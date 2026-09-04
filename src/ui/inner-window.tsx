import { ReactNode } from "react";
import { Icons } from "@/common/icons";
import { WindowCoordViewModel } from "@/store/view-models";
import { unitWindowHandlers } from "@/ui/desk-area-handlers";

export const InnerWindow = ({
  title,
  windowCoordVm,
  displayed,
  children,
  evacuated,
  close,
}: {
  title: string;
  windowCoordVm: WindowCoordViewModel;
  displayed: boolean;
  children: ReactNode;
  evacuated: boolean;
  close: () => void;
}) => {
  const { width, height } = windowCoordVm.size;
  return (
    <div
      className="absolute"
      style={{
        left: windowCoordVm.position.x,
        top: evacuated ? "40px" : windowCoordVm.position.y,
        // top: evacuated ? undefined : windowCoordVm.position.y,
        // bottom: evacuated ? "40px" : undefined,
        //windows are always exist in dom, so as to keep units working
        display: displayed ? "block" : "none",
      }}
    >
      <div style={{ width }}>
        <div
          className="bg-gray-500 flex-c h-34px cursor-pointer relative justify-end px-2"
          onPointerDown={(e) =>
            unitWindowHandlers.handleTitleBarPointerDown(e, windowCoordVm)
          }
        >
          <button
            type="button"
            className="cursor-pointer"
            onPointerDown={(e) => {
              close?.();
              e.stopPropagation();
            }}
          >
            <Icons.Close />
          </button>
          <div className="absolute-full flex-c pointer-events-none">
            {title}
          </div>
        </div>
        <div
          className="bg-white/50 text-black"
          style={{ height, display: evacuated ? "none" : "block" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
