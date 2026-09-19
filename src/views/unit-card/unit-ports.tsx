import { cz } from "@lib/utils/cz";
import { useCallback } from "react";
import { uiConstants, wireColors } from "@/common/theme";
import { isPortConnectable } from "@/domain/port-helpers";
import { UnitPortSpec } from "@/domain/types";
import { store } from "@/store/store";
import { UnitCardPortPositionManager } from "@/views/unit-card/unit-card-port-position-manager";
import { handlePortPointerDown } from "@/views/unit-card/unit-ports-handlers";

const PortView = ({
  portSpec,
  portPositionManager,
}: {
  portSpec: UnitPortSpec;
  portPositionManager: UnitCardPortPositionManager;
}) => {
  const { draggingPortKey } = store.useSnapshot();
  const isDragging = draggingPortKey !== null;

  const refCallback = useCallback(
    (el: HTMLDivElement) => {
      return portPositionManager.registerPort(portSpec, el);
    },
    [portSpec, portPositionManager],
  );
  const color = wireColors[portSpec.subtype];

  const isDraggingSelf = draggingPortKey === portSpec.portKey;
  const isConnectableTarget =
    draggingPortKey && isPortConnectable(draggingPortKey, portSpec.portKey);

  const active =
    !isDragging || (isDragging && (isDraggingSelf || isConnectableTarget));
  return (
    <div
      ref={refCallback}
      className="w-20px h-20px flex-c cursor-pointer relative"
      style={{ opacity: active ? 1 : uiConstants.dimmedWireOpacity }}
      onPointerDown={(e) => handlePortPointerDown(e, portSpec.portKey)}
    >
      <div
        className={cz(
          "w-11px aspect-square rounded-full",
          "border border-black/50 border-0.3px",
        )}
        style={{ background: color }}
      />
      {portSpec.label && (
        <div className="absolute-top-center -top-5px text-8px">
          {portSpec.label}
        </div>
      )}
    </div>
  );
};

export const UnitPortsColumn = ({
  portSpecs,
  portPositionManager,
}: {
  portSpecs: UnitPortSpec[];
  portPositionManager: UnitCardPortPositionManager;
}) => {
  return (
    <div className="flex-va gap-0.5 min-w-20px">
      {portSpecs.map((portSpec) => (
        <PortView
          key={portSpec.portKey}
          portSpec={portSpec}
          portPositionManager={portPositionManager}
        />
      ))}
    </div>
  );
};
