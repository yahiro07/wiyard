import { useCallback } from "react";
import { UnitPortSpec } from "@/domain/types";
import { UnitCardPortPositionManager } from "@/realms/unit-card/unit-card-port-position-manager";

const PortView = ({
  portSpec,
  portPositionManager,
}: {
  portSpec: UnitPortSpec;
  portPositionManager: UnitCardPortPositionManager;
}) => {
  const refCallback = useCallback(
    (el: HTMLDivElement) => {
      return portPositionManager.setPortElement(portSpec.portKey, el);
    },
    [portSpec.portKey, portPositionManager],
  );
  return (
    <div ref={refCallback} className="flex-ha">
      <div>{portSpec.direction === "input" ? "O" : "O"} </div>
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
