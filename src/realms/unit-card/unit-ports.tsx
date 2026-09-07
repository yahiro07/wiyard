import { useCallback } from "react";
import { wireColors } from "@/common/theme";
import { isPortConnectable } from "@/domain/port-helpers";
import { UnitPortSpec } from "@/domain/types";
import { UnitCardPortPositionManager } from "@/realms/unit-card/unit-card-port-position-manager";
import { handlePortPointerDown } from "@/realms/unit-card/unit-ports-models";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

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
      className={cz(
        "w-20px h-20px flex-c cursor-pointer",
        !active && "opacity-20",
      )}
      onPointerDown={(e) => handlePortPointerDown(e, portSpec.portKey)}
    >
      <div
        className={cz(
          "w-11px aspect-square rounded-full",
          "border border-black/50 border-0.3px",
        )}
        style={{ background: color }}
      />
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
          key={portSpec.id}
          portSpec={portSpec}
          portPositionManager={portPositionManager}
        />
      ))}
    </div>
  );
};
