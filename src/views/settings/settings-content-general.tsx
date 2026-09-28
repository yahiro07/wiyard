import { AppSettings } from "@/common/app-settings";
import { GraphElevationUnderlay } from "@/common/appearance";
import { Icons } from "@/common/icons";
import { CheckBoxLine } from "@/components/check-box-line";
import { store } from "@/store/store";
import { Button } from "@/views/settings/components/button";
import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";

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

export const SettingsContent_General = () => {
  return (
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
  );
};
