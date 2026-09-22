import { ControlSurfaceUnitItem } from "@/domain/types";
import { internalUnitCardIcons } from "@/domain/unit-entries";
import { unitCardHandlers } from "@/views/unit-card/unit-card-handlers";
import {
  EdgeUnitCardView,
  useUnitStuff,
} from "@/views/unit-card/unit-cards-common";

export const ControlSurfaceUnitCardRoot = ({
  unitItem,
}: {
  unitItem: ControlSurfaceUnitItem;
}) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  if (!unitStuff) return;
  const outputPortSpecs = unitStuff?.outputPortSpecs?.filter(
    (spec) => unitStuff.outputPortsOptInFlags?.[spec.id] ?? true,
  );
  if (outputPortSpecs?.length === 0) return;

  return (
    <EdgeUnitCardView
      key={outputPortSpecs?.map((it) => it.id).join(",")}
      unitItem={unitItem}
      inputPortSpecs={[]}
      outputPortSpecs={outputPortSpecs}
      highlighted={false}
      iconComponent={internalUnitCardIcons.controlSurface}
      label="surface"
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};
