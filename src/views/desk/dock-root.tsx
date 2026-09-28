import { cz } from "@lib/utils/cz";
import {
  DockCleanupButtons,
  WindowDockItem,
  WindowDockItemView,
  WindowDockMV,
} from "@lib/window-system";
import { IconType } from "react-icons";
import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store, windowSystem } from "@/store/store";
import { builtinAppItems } from "@/domain/builtin-app-entries";
import { getCatalogItemWithFallback } from "@/domain/unit-entries";
import { appConfig } from "@/common/app-config";
import { getSortOrder } from "@lib/utils/array-object-helper";
import { ScalerBoxSC } from "@lib/components/headless/scaler-box-sc";

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

const UnitDockItemsView = () => {
  const { unitItems, windowSpecs } = store.useSnapshot();
  const sortedItems = unitItems
    .filter((item) => item.type === "board")
    .sort(
      getSortOrder((item) => {
        const windowSpec = windowSpecs[item.unitId];
        return windowSpec?.position.x ?? 99999;
      }),
    );
  return (
    <>
      {sortedItems.map((item) => {
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
  );
};

const BuiltinDockItemsView = ({ target }: { target: "head" | "rest" }) => {
  const items =
    target === "head" ? builtinAppItems.slice(0, 1) : builtinAppItems.slice(1);
  return (
    <>
      {items.map((item) => {
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
  );
};

const ElevationButton = () => {
  const { graphAreaElevated } = store.useSnapshot();
  return (
    <WindowDockItemView
      title="elevation"
      onClick={actions.toggleGraphAreaElevated}
      children={
        <DockIcon
          icon={Icons.StackForward}
          bgColor={graphAreaElevated ? "#6bf" : "#909098"}
          textColor="#fff"
          fontSize={30}
        />
      }
    />
  );
};

const DeskViewButton = () => {
  return (
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
  );
};

const PluginPickerButton = () => {
  return (
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
  );
};

const DockContentsCentered = () => {
  return (
    <div
      className="grid w-full items-center gap-6"
      style={{ gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)" }}
    >
      <div className="flex-ha gap-2 justify-end">
        <BuiltinDockItemsView target="rest" />
      </div>

      <div className="flex-ha gap-2">
        <BuiltinDockItemsView target="head" />
        <DeskViewButton />
        {false && <ElevationButton />}
        <PluginPickerButton />
        <DockCleanupButtons />
      </div>

      <div className="flex-ha gap-2">
        <UnitDockItemsView />
      </div>
    </div>
  );
};

const DockContents = () => {
  return (
    <div className="flex-c gap-2">
      <BuiltinDockItemsView target="head" />
      <DeskViewButton />
      {false && <ElevationButton />}
      <PluginPickerButton />
      <BuiltinDockItemsView target="rest" />
      <UnitDockItemsView />
      <DockCleanupButtons />
    </div>
  );
};

export const InnerDockRoot = () => {
  if (appConfig.dockPlacement === "bottomBar") return;
  return (
    <div
      className={cz(
        appConfig.dockPlacement === "leftInner"
          ? "absolute-left-center"
          : "absolute-right-center",
      )}
    >
      <WindowDockMV>
        <DockContents />
      </WindowDockMV>
    </div>
  );
};

export const BottomBarWithDock = () => {
  if (appConfig.dockPlacement !== "bottomBar") return;
  return (
    <div className="py-2.5 bg-gray-600 flex-c">
      <ScalerBoxSC scale={0.9}>
        {false ? <DockContentsCentered /> : <DockContents />}
      </ScalerBoxSC>
    </div>
  );
};
