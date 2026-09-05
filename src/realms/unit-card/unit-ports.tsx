import { UnitPortSpec } from "@/domain/unit-stuff";
import { UnitCardPortPositionManager } from "@/realms/unit-card/unit-card-port-position-manager";

const PortView = ({
  portSpec,
  portPositionManager,
}: {
  portSpec: UnitPortSpec;
  portPositionManager: UnitCardPortPositionManager;
}) => {
  return (
    <div
      ref={(el) => portPositionManager.setPortElement(portSpec.portKey, el)}
      className="flex-ha"
    >
      <div>{portSpec.direction === "input" ? "I" : "O"} </div>
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
    <div className="flex-v gap-0.5">
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
