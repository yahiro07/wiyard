import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { Button } from "@/views/settings/components/button";
import { SettingsContent_General } from "@/views/settings/settings-content-general";
import { SettingsContent_Theme } from "@/views/settings/settings-content-theme";
import { useHandleClickOutside } from "@lib/utils/use-handle-click-outside";
import { useRef } from "react";

const SettingsPanelTabButtons = () => {
  const { settingsPanelTab } = store.useSnapshot();
  return (
    <div className="flex-ha gap-1.5">
      <Button
        active={settingsPanelTab === "general"}
        onClick={() => store.setSettingsPanelTab("general")}
      >
        General
      </Button>
      <Button
        active={settingsPanelTab === "theme"}
        onClick={() => store.setSettingsPanelTab("theme")}
      >
        Theme
      </Button>
    </div>
  );
};

const SettingsPanel = () => {
  const { settingsPanelTab } = store.useSnapshot();
  return (
    <div className="w-340px m-2">
      <div className="flex-ha gap-2px px-1.5 h-30px text-white bg-gray-500">
        <Icons.Settings size={18} />
        <h3 className="font-500 text-17px">Settings</h3>
      </div>
      <div className="bg-#ccc p-3 text-#444 min-h-400px">
        <div className="flex-v gap-2">
          <SettingsPanelTabButtons />
          {settingsPanelTab === "general" && <SettingsContent_General />}
          {settingsPanelTab === "theme" && <SettingsContent_Theme />}
        </div>
      </div>
    </div>
  );
};

const SettingsPanelOuter = () => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(
    baseDivRef,
    () => {
      store.setSettingsPanelVisible(false);
    },
    {
      targetMethod: "pointerdown",
      withStopPropagation: true,
      excludeButtons: true,
    },
  );
  return (
    <div ref={baseDivRef}>
      <SettingsPanel />
    </div>
  );
};

export const SettingsPanelRoot = () => {
  const { settingsPanelVisible } = store.useSnapshot();
  if (!settingsPanelVisible) return null;
  return (
    <div className="absolute top-0 right-0">
      <SettingsPanelOuter />
    </div>
  );
};
