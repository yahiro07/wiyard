import { ReactNode } from "react";
import { WindowCoordViewModel } from "@/store/view-models";
import { unitWindowHandlers } from "@/ui/desk-area-handlers";

export const BoardWindow = ({
  title,
  windowCoordVm,
  displayed,
  children,
  evacuated,
}: {
  title: string;
  windowCoordVm: WindowCoordViewModel;
  displayed: boolean;
  children: ReactNode;
  evacuated: boolean;
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: windowCoordVm.position.x,
        top: evacuated ? "40px" : windowCoordVm.position.y,
        // top: evacuated ? undefined : windowCoordVm.position.y,
        // bottom: evacuated ? "40px" : undefined,
        display: displayed ? "block" : "none",
      }}
    >
      <div style={{ width: 600 }}>
        <div
          className="bg-gray-500 flex-c py-1 cursor-pointer"
          onPointerDown={(e) =>
            unitWindowHandlers.handleTitleBarPointerDown(e, windowCoordVm)
          }
        >
          {title}
        </div>
        <div
          className="bg-white/50 text-black"
          style={{ height: 400, display: evacuated ? "none" : "block" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
