import { cz } from "@lib/utils/cz";
import {
  WindowDock,
  WindowDockItem,
  WindowDockItemView,
} from "@lib/window-system";
import { IconType } from "react-icons";
import { Icons } from "@/common/icons";
import { kSequencerWindowId } from "@/domain/types";
import { catalog } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";

const DockIcon = ({
  icon: IconComponent,
  bgColor,
  textColor,
  fontSize,
}: {
  icon: IconType;
  bgColor: string;
  textColor: string;
  fontSize: number;
}) => {
  return (
    <div
      className={cz("flex-c h-full")}
      style={{
        background: bgColor,
        color: textColor,
      }}
    >
      <IconComponent size={fontSize} />
    </div>
  );
};

export const DockRoot = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <WindowDock>
      <WindowDockItemView
        title="plugin picker"
        onClick={actions.toggleUnitPickerVisible}
        children={
          <DockIcon
            icon={Icons.Apps}
            bgColor="#fff"
            textColor="#ccd"
            fontSize={30}
          />
        }
      />
      <WindowDockItemView
        title="desk view"
        onClick={windowSystem.toggleEvacuate}
        children={
          <DockIcon
            icon={Icons.Desktop}
            bgColor="#909098"
            textColor="#fff"
            fontSize={24}
          />
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
          <DockIcon
            icon={Icons.Timeline}
            bgColor="#46a"
            textColor="#fff"
            fontSize={28}
          />
        }
      />
    </WindowDock>
  );
};
