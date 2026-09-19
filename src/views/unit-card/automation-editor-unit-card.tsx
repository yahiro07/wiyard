import { internalUnitCardIcons } from "@/domain/unit-entries";
import { automationChannelGetters } from "@/store/automation-channel-getters";
import { unitCardHandlers } from "@/views/unit-card/unit-card-handlers";
import { EdgeUnitCardView } from "@/views/unit-card/unit-cards-common";

export const AutomationEditorUnitCardRoot = () => {
  const automationUnitItems =
    automationChannelGetters.useAutomationEditorUnitItems();
  const firstItem = automationUnitItems[0];
  const outputPortSpecs =
    automationChannelGetters.useAutomationEditorOutputPortSpecs();
  if (!firstItem) return;

  const key = automationUnitItems.map((item) => item.unitId).join(",");

  //show single card with the ports of multiple units
  return (
    <EdgeUnitCardView
      key={key}
      unitItem={firstItem}
      inputPortSpecs={[]}
      outputPortSpecs={outputPortSpecs}
      highlighted={false}
      iconComponent={internalUnitCardIcons.automationChannel}
      label="automation"
      handlePointerDown={(e) =>
        unitCardHandlers.handlePointerDown(e, firstItem)
      }
    />
    // <>
    //   <div
    //     className="absolute"
    //     style={{
    //       left: firstItem.cardPosition.x,
    //       top: firstItem.cardPosition.y,
    //     }}
    //   >
    //     <div className="flex-ha gap-1">
    //       <div className="w-90px h-90px bg-white/10 flex-c relative shadow-md" />
    //       <div className="flex-v gap-1">
    //         {uniteItems.map((item, i) => (
    //           <div className="flex-ha gap-1">
    //             <div className="text-10px">{i + 1}</div>
    //             <div className="w-10px h-10px bg-#f08 rounded-full" />
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};
