import { cz } from "@lib/utils/cz";
import {
  WindowDock,
  WindowDockItem,
  WindowDockItemView,
} from "@lib/window-system";
import { IconType } from "react-icons";
import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";
import { builtinAppItems } from "@/domain/builtin-app-entries";
import { getCatalogItemWithFallback } from "@/domain/unit-entries";
import { appConfig } from "@/common/app-config";

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
    <div
      className={cz(
        "z-1",
        appConfig.dockSide === "left"
          ? "absolute-left-center"
          : "absolute-right-center",
      )}
    >
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
          onClick={windowSystem.toggleMinimizeAll}
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
              const catalogItem = getCatalogItemWithFallback(item.catalogKey);
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
        <>
          {builtinAppItems.map((item) => {
            const { windowId, title, dockItemSpec } = item;
            return (
              <WindowDockItem
                key={windowId}
                id={windowId}
                title={title}
                children={
                  <DockIcon
                    icon={dockItemSpec.icon}
                    bgColor={dockItemSpec.bgColor}
                    textColor="#fff"
                    fontSize={dockItemSpec.fontSize}
                  />
                }
              />
            );
          })}
        </>
      </WindowDock>
    </div>
  );
};
