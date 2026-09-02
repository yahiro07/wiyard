import { startDragSession } from "beams/ax-ui/drag-session";
import { npx } from "beams/ax-ui/styling-utils";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { Icons, IconsEx } from "@/components/icons";
import { UnitFrameEx } from "@/organisms/unit-frame-ex";
import { actions } from "@/store/actions";
import { getZoomScaling } from "@/store/helper";
import { store, UnitItem } from "@/store/store";

const PortCell = ({
  withIcon,
  onPointerDown,
}: {
  withIcon?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
}) => {
  return (
    <div
      className="w-[30px] h-[30px] bg-gray-400 cursor-pointer flex-c text-gray-100"
      onPointerDown={onPointerDown}
    >
      {withIcon && <IconsEx.ConnectorPortUp />}
    </div>
  );
};

const OutputPortCell = ({ unit }: { unit: UnitItem }) => {
  const handlePointerDown = (_: React.PointerEvent) => {
    if (unit.destUnitId) {
      actions.removeConnection(unit.unitId);
    } else {
      actions.connectToNearestUnit(unit.unitId);
    }
  };
  return <PortCell withIcon onPointerDown={handlePointerDown} />;
};

const PortRelativePositionDebugOverlay = () => {
  const inputPos = slotCardDimensions.inputPort;
  const outputPos = slotCardDimensions.outputPort;
  return (
    <div className="absolute w-full h-full">
      <div
        className="absolute w-[30px] h-[30px] bg-pink-500 opacity-30"
        style={{
          left: npx(outputPos.x),
          top: npx(outputPos.y),
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute w-[30px] h-[30px] bg-pink-500 opacity-30"
        style={{
          left: npx(inputPos.x),
          top: npx(inputPos.y),
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

const handleGripPointerDown = (e0: React.PointerEvent, unit: UnitItem) => {
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

export const SlotCardBox = ({
  unit,
  notes,
}: {
  unit: UnitItem;
  notes?: number[];
}) => {
  const sd = slotCardDimensions;
  return (
    <div
      className="absolute"
      style={{
        left: npx(unit.position.x - sd.width / 2),
        top: npx(unit.position.y - sd.height / 2),
      }}
    >
      <div
        className="relative flex-h"
        style={{
          width: npx(sd.width),
          height: npx(sd.height),
        }}
      >
        <div className="w-[40px] bg-gray-500 flex-v justify-between items-center p-2">
          <OutputPortCell unit={unit} />
          <PortCell />
        </div>
        <div className="grow bg-gray-600">
          <UnitFrameEx
            unitId={unit.unitId}
            destUnitId={unit.destUnitId}
            catalogKey={unit.catalogKey}
            notes={notes}
          />
        </div>
        <div className="w-[40px] bg-gray-500 flex-v text-white py-1">
          <div
            className="h-[40px] flex-c text-[22px] cursor-pointer"
            onClick={() => actions.removeUnit(unit.unitId)}
          >
            <Icons.DeleteBin />
          </div>
          <div
            className="grow flex-c text-[28px] cursor-pointer pb-[40px]"
            onPointerDown={(e) => handleGripPointerDown(e, unit)}
          >
            <Icons.Grip />
          </div>
          {/* <div
            className="bd-red h-[40px] flex-c text-[20px] cursor-pointer"
            onPointerDown={(e) => handleGripPointerDown(e, unit)}
          /> */}
        </div>
        {false && <PortRelativePositionDebugOverlay />}
      </div>
    </div>
  );
};
