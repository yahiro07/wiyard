import { Icons } from "@/common/icons";
import { safeInvoke } from "@/periphery/wrap-unit-call";
import { SelectorOption } from "@lib/utils/selector-option";
import { useMemo, useState } from "react";
import { PresetProvider } from "wafer-host/unit-types";
import { GeneralSelector } from "@lib/components/headless/general-selector";
import { cz } from "@lib/utils/cz";

type PresetsViewModel = {
  presetOptions: SelectorOption<string>[];
  selectPreset(presetName: string): void;
  shiftPreset(dir: -1 | 1): void;
  commandNames: string[];
  applyCommand(commandName: string): void;
  currentPresetName: string;
};

function usePresetsViewModel(presetProvider: PresetProvider): PresetsViewModel {
  const { presetNames, presetOptions, commandNames } = useMemo(() => {
    const presetNames = safeInvoke(presetProvider.getPresetNames)?.() ?? [];
    const commandNames = safeInvoke(presetProvider.getCommandNames)?.() ?? [];
    const presetOptions: SelectorOption<string>[] = [
      { label: "--", value: "--" },
      ...presetNames.map((it) => ({
        label: it,
        value: it,
      })),
    ];
    return { presetNames, presetOptions, commandNames };
  }, [presetProvider]);

  const [currentPresetIndex, setCurrentPresetIndex] = useState(-1);
  const currentPresetName = presetNames[currentPresetIndex] ?? "--";

  const handlers = {
    selectPresetByIndex(index: number) {
      if (0 <= index && index < presetNames.length) {
        safeInvoke(presetProvider.applyPreset)?.(presetNames[index]);
        setCurrentPresetIndex(index);
      } else {
        setCurrentPresetIndex(-1);
      }
    },
    selectPreset: (presetName: string) => {
      const index = presetNames.indexOf(presetName);
      handlers.selectPresetByIndex(index);
    },
    shiftPreset: (dir: -1 | 1) => {
      const nextIndex =
        currentPresetIndex === -1
          ? 0
          : (currentPresetIndex + dir + presetNames.length) %
            presetNames.length;
      handlers.selectPresetByIndex(nextIndex);
    },
    applyCommand: (commandName: string) => {
      if (!commandNames.includes(commandName)) return;
      const shouldResetSelection = safeInvoke(presetProvider.applyCommand)?.(
        commandName,
      );
      if (shouldResetSelection) {
        handlers.selectPresetByIndex(-1);
      }
    },
  };

  return {
    presetOptions,
    selectPreset: handlers.selectPreset,
    shiftPreset: handlers.shiftPreset,
    commandNames,
    applyCommand: handlers.applyCommand,
    currentPresetName,
  };
}

const PresetPanel = ({
  presetProvider,
}: {
  presetProvider: PresetProvider;
}) => {
  const vm = usePresetsViewModel(presetProvider);

  const classes = {
    panelBase: "flex-vc bg-#ccc gap-3 w-full h-full p-3",
    arrowButton:
      "cursor-pointer bg-gray-500/90 w-26px h-26px hover:opacity-90 text-xs",
    selectorOuter:
      "relative w-90px h-26px border bg-white flex-c hover:opacity-90",
    selector: cz(
      "w-full h-full",
      "border-none outline-none appearance-none cursor-pointer hover:opacity-90",
    ),
    selectorDisplay: cz(
      "absolute-full flex-c bg-#fff text-#333 text-xs pointer-events-none",
    ),
    actionButton:
      "cursor-pointer bg-gray-500/90 px-1.5 h-26px hover:opacity-90 text-xs font-500",
  };
  return (
    <div className={classes.panelBase}>
      {vm.presetOptions.length > 1 && (
        <div className="flex-ha">
          <button
            className={classes.arrowButton}
            onClick={() => vm.shiftPreset(-1)}
          >
            ◀
          </button>
          <div className={classes.selectorOuter}>
            <GeneralSelector
              className={classes.selector}
              options={vm.presetOptions}
              value={vm.currentPresetName}
              onChange={vm.selectPreset}
            />
            <div className={classes.selectorDisplay}>
              {vm.currentPresetName}
            </div>
          </div>
          <button
            className={classes.arrowButton}
            onClick={() => vm.shiftPreset(1)}
          >
            ▶
          </button>
        </div>
      )}
      <div className="flex-h gap-2">
        {vm.commandNames.map((commandName) => (
          <button
            key={commandName}
            className={classes.actionButton}
            onClick={() => vm.applyCommand(commandName)}
          >
            {commandName}
          </button>
        ))}
      </div>
    </div>
  );
};

export const UnitPresetsMenuButton = ({
  presetProvider,
}: {
  presetProvider: PresetProvider;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-30px h-30px -mr-7px relative">
      <button
        className="w-full h-full flex-c cursor-pointer hover:opacity-80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icons.Menu />
      </button>
      {isOpen && (
        <div className="absolute top-31px right-0 z-1">
          <PresetPanel presetProvider={presetProvider} />
        </div>
      )}
    </div>
  );
};
