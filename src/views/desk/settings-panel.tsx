import { AppSettings } from "@/common/app-settings";
import { store } from "@/store/store";
import { cz } from "@lib/utils/cz";
import { ReactNode, useRef } from "react";

const settingsActions = {
  setSettingValue<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    store.patchSettings({ [key]: value });
  },
};

const SettingRow = ({
  header,
  children,
}: {
  header: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex-ha gap-2">
      <div>{header}</div>
      <div>{children}</div>
    </div>
  );
};

const UiScalingSelectorButtons = () => {
  const {
    settings: { uiScaling },
  } = store.useSnapshot();
  const values = [0.8, 0.9, 1, 1.1, 1.2];
  const styles = {
    base: "px-1 h-28px rounded bg-gray-400 min-w-34px cursor-pointer text-sm",
    active: "!bg-#8ae text-white",
  };
  return (
    <div className="flex-ha gap-1">
      {values.map((value) => {
        const active = value === uiScaling;
        return (
          <button
            key={value}
            className={cz(styles.base, active && styles.active)}
            onClick={() => settingsActions.setSettingValue("uiScaling", value)}
          >
            {value}x
          </button>
        );
      })}
    </div>
  );
};

const SettingsPanel = () => {
  return (
    <div className="w-300px m-2">
      <div className="flex-ha px-2 h-30px text-white bg-gray-500 font-500">
        <h3>Settings</h3>
      </div>
      <div className="bg-#ccc p-2 text-#444 min-h-350px">
        <SettingRow header="UI Scaling">
          <UiScalingSelectorButtons />
        </SettingRow>
      </div>
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
