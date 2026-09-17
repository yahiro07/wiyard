import { automationChannelGetters } from "@/store/automation-channel-getters";

export const AutomationEditorUnitCardRoot = () => {
  const uniteItems = automationChannelGetters.useAutomationEditorUnitItems();
  const firstItem = uniteItems[0];
  if (!firstItem) return;

  //show single card with the ports of multiple units
  return (
    <>
      <div
        className="absolute"
        style={{
          left: firstItem.cardPosition.x,
          top: firstItem.cardPosition.y,
        }}
      >
        <div className="flex-ha gap-1">
          <div className="w-90px h-90px bg-white/10 flex-c relative shadow-md" />
          <div className="flex-v gap-1">
            {uniteItems.map((item, i) => (
              <div className="flex-ha gap-1">
                <div className="text-10px">{i + 1}</div>
                <div className="w-10px h-10px bg-#f08 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
