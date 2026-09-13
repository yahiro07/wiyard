import { WindowDock, WindowDockItem } from "@lib/window-system";
import { kSequencerWindowId } from "@/domain/types";
import { catalog } from "@/domain/unit-entries";
import { store } from "@/store/store";

export const DockRoot = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <WindowDock>
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
      <WindowDockItem id={kSequencerWindowId} title="piano roll" />
    </WindowDock>
  );
};
