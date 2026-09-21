import { store } from "@/store/store";
import { useRef } from "react";

const SettingsPanel = () => {
  return (
    <div className="w-300px bg-#ccc p-2 text-#444 m-2 min-h-400px">
      <h3>Settings</h3>
      <div>aaa</div>
    </div>
  );
};

const SettingsPanelOuter = () => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  // useHandleClickOutside(
  //   baseDivRef,
  //   () => {
  //     store.setSettingsPanelVisible(false);
  //   },
  //   { targetMethod: "click", withPropagation: true },
  // );
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
