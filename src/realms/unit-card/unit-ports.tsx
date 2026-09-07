import { useCallback } from "react";
import { wireColors } from "@/common/theme";
import { UnitPortSpec } from "@/domain/types";
import { UnitCardPortPositionManager } from "@/realms/unit-card/unit-card-port-position-manager";
import { cz } from "@/utils/cz";

const PortView = ({
  portSpec,
  portPositionManager,
}: {
  portSpec: UnitPortSpec;
  portPositionManager: UnitCardPortPositionManager;
}) => {
  const refCallback = useCallback(
    (el: HTMLDivElement) => {
      return portPositionManager.registerPort(portSpec, el);
    },
    [portSpec, portPositionManager],
  );
  const color = wireColors[portSpec.subtype];
  return (
    <div ref={refCallback} className="w-20px h-20px flex-c cursor-pointer">
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
