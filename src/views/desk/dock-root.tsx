import {
  WindowDock,
  WindowDockItem,
  WindowDockItemView,
} from "@lib/window-system";
import { Icons } from "@/common/icons";
import { kSequencerWindowId } from "@/domain/types";
import { catalog } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const DockRoot = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <WindowDock>
      <WindowDockItemView
        title="apps"
        onClick={actions.toggleUnitPickerVisible}
        children={
          <div className="flex-c h-full bg-#fff text-#ccd text-28px">
            <Icons.Apps />
          </div>
        }
      />
      <>
        {unitItems
          .filter((item) => item.type === "board")
          .map((item) => {
            const catalogItem = catalog[item.catalogKey];
            return (
              <WindowDockItem
                key={item.unitId}
                id={item.unitId}
                title={catalogItem.name}
                imageUrl={catalogItem.thumbnailUrl}
              />
            );
          })}
      </>
      <WindowDockItem
        id={kSequencerWindowId}
        title="piano roll"
        children={
          <div className="flex-c h-full bg-#46a text-24px">
            <Icons.Timeline />
          </div>
        }
      />
    </WindowDock>
  );
};
