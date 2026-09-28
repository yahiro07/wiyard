import { AppSettings } from "@/common/app-settings";
import { GraphElevationUnderlay } from "@/common/appearance";
import { Icons } from "@/common/icons";
import { CheckBoxLine } from "@/components/check-box-line";
import { store } from "@/store/store";
import { cz } from "@lib/utils/cz";
import { useHandleClickOutside } from "@lib/utils/use-handle-click-outside";
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
  children?: ReactNode;
}) => {
  return (
    <div className="flex-ha gap-2">
      <div className="font-500 flex-ha gap-2px">
        <Icons.Tag />
        {header}
      </div>
      <div>{children}</div>
    </div>
  );
};

const Button = ({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => {
  const styles = {
    base: "px-1 h-28px rounded-3px bg-gray-400 min-w-34px cursor-pointer text-12px font-500",
    active: "!bg-#8ae text-white",
    disabled: "opacity-30 pointer-events-none",
  };
  return (
    <button
      className={cz(
        styles.base,
        active && styles.active,
        disabled && styles.disabled,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const UiScalingSelectorButtons = () => {
  const {
    settings: { uiScaling },
  } = store.useSnapshot();
  const values = [0.8, 0.9, 1, 1.1, 1.2];

  return (
    <div className="flex-ha gap-1">
      {values.map((value) => {
        const active = value === uiScaling;
        return (
          <Button
            key={value}
            active={active}
            onClick={() => settingsActions.setSettingValue("uiScaling", value)}
          >
            {value}x
          </Button>
        );
      })}
    </div>
  );
};

const CommonFeaturesRows = () => {
  const { settings } = store.useSnapshot();

  return (
    <>
      <CheckBoxLine
        label="Wire volume knob"
        checked={settings.wireVolumeKnobs}
        onChange={(value) =>
          settingsActions.setSettingValue("wireVolumeKnobs", value)
        }
      />
      <CheckBoxLine
        label="Part control bar"
        checked={settings.partControlBar}
        onChange={(value) =>
          settingsActions.setSettingValue("partControlBar", value)
        }
      />
      <CheckBoxLine
        label="Mouse wheel zoom"
        checked={settings.mouseWheelZoom}
        onChange={(value) =>
          settingsActions.setSettingValue("mouseWheelZoom", value)
        }
      />
      <CheckBoxLine
        label="Piano roll window side grip"
        checked={settings.pianoRollWindowSideGrip}
        onChange={(value) =>
          settingsActions.setSettingValue("pianoRollWindowSideGrip", value)
        }
      />
    </>
  );
};

const AppearanceRows = () => {
  const { settings } = store.useSnapshot();
  const setUnderlay = (value: GraphElevationUnderlay) => {
    settingsActions.setSettingValue("graphElevationUnderlay", value);
  };
  const value = settings.graphElevationUnderlay;
  return (
    <>
      <CheckBoxLine
        label="Graph Elevation"
        checked={settings.graphElevation}
        onChange={(value) =>
          settingsActions.setSettingValue("graphElevation", value)
        }
      />
      <div className="flex-ha gap-1">
        <div className={cz(!settings.graphElevation && "opacity-30")}>
          Underlay
        </div>
        <Button
          active={value === "solid"}
          disabled={!settings.graphElevation}
          onClick={() => setUnderlay("solid")}
          children="Solid"
        />
        <Button
          active={value === "frosted"}
          disabled={!settings.graphElevation}
          onClick={() => setUnderlay("frosted")}
          children="Frosted"
        />
        <Button
          active={value === "clear"}
          disabled={!settings.graphElevation}
          onClick={() => setUnderlay("clear")}
          children="Clear"
        />
      </div>
    </>
  );
};

const SettingsPanel = () => {
  return (
    <div className="w-340px m-2">
      <div className="flex-ha gap-2px px-1.5 h-30px text-white bg-gray-500">
        <Icons.Settings size={18} />
        <h3 className="font-500 text-17px">Settings</h3>
      </div>
      <div className="bg-#ccc p-3 text-#444 min-h-400px">
        <div className="flex-v gap-2">
          <SettingRow header="UI Scaling">
            <UiScalingSelectorButtons />
          </SettingRow>
          <div className="flex-v">
            <SettingRow header="Common Features" />
            <div className="ml-3">
              <div className="flex-v gap-1 mt-1">
                <CommonFeaturesRows />
                <AppearanceRows />
              </div>
            </div>
          </div>
          {false && (
            <div className="flex-v">
              <SettingRow header="Current Project" />
              <div className="ml-3">
                <div className="flex-v gap-1 mt-1">
                  <CheckBoxLine label="Piano roll" checked={false} />
                  <CheckBoxLine label="Automation" checked={false} />
                  <CheckBoxLine label="Control surface" checked={false} />
                  <CheckBoxLine label="Keyboard" checked={false} />
                </div>
              </div>
            </div>
          )}
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
