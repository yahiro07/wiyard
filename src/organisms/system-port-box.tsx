import { startDragSession } from "beams/ax-ui/drag-session";
import { npx } from "beams/ax-ui/styling-utils";
import clsx from "clsx";
import { ReactNode } from "react";
import { Icons, IconsEx } from "@/components/icons";
import { actions } from "@/store/actions";
import { getZoomScaling } from "@/store/helper";
import { SystemPortUnitItem, store } from "@/store/store";

const handleGripPointerDown = (
  e0: React.PointerEvent,
  unit: SystemPortUnitItem,
) => {
  const originalPosition = { ...unit.position };
  startDragSession(
    e0.nativeEvent,
    {
      onMove(e) {
        const delta = {
          x: e.position.x - e.originalPosition.x,
          y: e.position.y - e.originalPosition.y,
        };
        const sc = getZoomScaling(store.state.sight.zoom);
        const newPosition = {
          x: originalPosition.x + delta.x / sc,
          y: originalPosition.y + delta.y / sc,
        };
        actions.setUnitPosition(unit.unitId, newPosition);
      },
    },
    { coordinate: "screen" },
  );
};

const SystemPortBox = ({
  unit,
  iconContent,
  sideContent,
  yOffset = 0,
}: {
  unit: SystemPortUnitItem;
  iconContent: ReactNode;
  sideContent?: ReactNode;
  yOffset?: number;
}) => {
  return (
    <div
      className={clsx("absolute -translate-x-1/2 -translate-y-1/2")}
      style={{
        left: npx(unit.position.x),
        top: npx(unit.position.y + yOffset),
      }}
    >
      <div className="relative">
        <div className="flex-c w-[80px] h-[120px] bg-gray-500 text-gray-300">
          {iconContent}
        </div>
        <div className="absolute left-[80px] top-0">
          <div className="flex-h w-[400px] h-[120px]">
            <div className="grow">{sideContent}</div>
            <div className="w-[80px] bg-gray-500">
              <div
                className="flex-c text-[40px] cursor-pointer text-white h-full"
                onPointerDown={(e) => handleGripPointerDown(e, unit)}
              >
                <Icons.Grip />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SpeakerSystemPortBox = () => {
  const { speakerPort } = store.useSnapshot();
  return (
    <SystemPortBox
      unit={speakerPort}
      yOffset={-50}
      iconContent={<Icons.Speaker size={65} />}
      sideContent={<div className="h-full bg-black text-white">aaa</div>}
    />
  );
};

const handleKeyboardPortClick = () => {
  const { keyboardPort } = store.state;
  if (keyboardPort.destUnitId === undefined) {
    actions.connectToNearestUnit("$keyboard");
  } else {
    actions.removeConnection("$keyboard");
  }
};
export const KeyboardSystemPortBox = () => {
  const { keyboardPort } = store.useSnapshot();
  return (
    <SystemPortBox
      unit={keyboardPort}
      yOffset={50}
      iconContent={
        <div
          className="relative w-full h-full flex-c cursor-pointer"
          onClick={handleKeyboardPortClick}
        >
          <Icons.Piano size={65} />
          <div className="absolute-full flex-h justify-center p-1">
            <IconsEx.ConnectorPortUp size={18} />
          </div>
        </div>
      }
      sideContent={<div className="h-full bg-white text-black">bbb</div>}
    />
  );
};
