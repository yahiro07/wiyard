import { internalUnitCardIcons } from "@/domain/unit-entries";
import { store } from "@/store/store";
import { unitCardHandlers } from "@/views/unit-card/unit-card-handlers";
import { EdgeUnitCardView } from "@/views/unit-card/unit-cards-common";

export const ControlSurfaceUnitCardRoot = () => {
  const { unitItems, unitStuffs } = store.useSnapshot();
  const unitItem = unitItems.find((item) => item.type === "controlSurface");
  if (!unitItem) return;
  const unitStuff = unitStuffs[unitItem.unitId];
  const outputPortSpecs = unitStuff?.outputPortSpecs?.filter(
    (spec) => unitStuff.outputPortsOptInFlags?.[spec.id] ?? true,
  );
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
