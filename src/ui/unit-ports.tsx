import { UnitPortSpec } from "@/definitions/unit-stuff";

const PortView = ({ portSpec }: { portSpec: UnitPortSpec }) => {
  return (
    <div className="flex-ha">
      <div>{portSpec.direction === "input" ? "I" : "O"} </div>
    </div>
  );
};

export const UnitPortsColumn = ({
  portSpecs,
}: {
  portSpecs: UnitPortSpec[];
}) => {
  return (
    <div className="flex-v gap-0.5">
      {portSpecs.map((portSpec) => (
        <PortView key={portSpec.id} portSpec={portSpec} />
      ))}
    </div>
  );
};
