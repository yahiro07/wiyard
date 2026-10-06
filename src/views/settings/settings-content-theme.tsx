import { Icons } from "@/common/icons";
import { presetUiThemes } from "@/common/ui-theme";
import { ColorEditButton } from "@/components/color-edit-button";
import { Knob } from "@/components/knob";
import { UpperLabel } from "@/components/upper-label";
import { autoPersistenceTask } from "@/periphery/auto-persistence-task";
import { store } from "@/store/store";
import { IconButton } from "@/views/settings/components/icon-button";
import { loadLocalImageFile } from "@/views/settings/local-image-file-loader";
import { GeneralSelector } from "@lib/components/headless/general-selector";
import { cz } from "@lib/utils/cz";
import { createSelectorOptions } from "@lib/utils/selector-option";

const handlers = {
  async loadImage() {
    const imageDataUrl = await loadLocalImageFile();
    if (imageDataUrl) {
      console.log(
        `image loaded (${(imageDataUrl.length / 1024).toFixed()} KB)`,
      );
      store.patchUiTheme({ boardBgImageUrl: imageDataUrl });
      localStorage.setItem("boardBgImageUrl", imageDataUrl);
      autoPersistenceTask.ensureLatestSaved();
    }
  },
  clearImage() {
    store.patchUiTheme({ boardBgImageUrl: null });
    localStorage.removeItem("boardBgImageUrl");
    autoPersistenceTask.ensureLatestSaved();
  },
  setPreset(index: number) {
    if (index !== -1) {
      store.setUiTheme(presetUiThemes[index]);
    }
  },
};

const presetOptions = createSelectorOptions<number>([
  [-1, "--"],
  ...presetUiThemes.map((theme, i) => [i, theme.name] as [number, string]),
]);

const PresetSelector = () => {
  const styles = {
    selectorOuter: "relative w-90px h-26px flex-c hover:opacity-80",
    selector: cz(
      "size-full border-none outline-none appearance-none cursor-pointer",
    ),
    selectorDisplay: cz(
      "absolute-full flex-ha gap-2 justify-between px-2",
      "bg-#ddd text-#333 text-xs pointer-events-none",
    ),
  };
  return (
    <div className={styles.selectorOuter}>
      <GeneralSelector
        className={styles.selector}
        options={presetOptions}
        value={-1}
        onChange={handlers.setPreset}
      />
      <div className={styles.selectorDisplay}>
        <span>Preset</span>
        <Icons.ArrowDown />
      </div>
    </div>
  );
};

const ThemeEditContents = () => {
  const { uiTheme } = store.useSnapshot();
  const { patchUiTheme } = store;

  const styles = {
    header: "text-13px font-500 text-white bg-#aaa w-80px h-30px flex-c",
  };
  return (
    <div className="flex-v gap-4">
      <div className="flex-ha pt-2 gap-4">
        <h3 className={styles.header}>Board</h3>
        <UpperLabel label="color">
          <ColorEditButton
            color={uiTheme.boardBgColor}
            onChange={(v) => patchUiTheme({ boardBgColor: v })}
          />
        </UpperLabel>
        <UpperLabel label="image">
          <div className="flex-ha gap-1">
            <IconButton
              icon={Icons.Image}
              size={26}
              active={uiTheme.boardBgImageUrl !== null}
              onClick={handlers.loadImage}
            />
            {uiTheme.boardBgImageUrl !== null && (
              <IconButton
                icon={Icons.Trash}
                active={true}
                size={16}
                onClick={handlers.clearImage}
              />
            )}
          </div>
        </UpperLabel>
        <UpperLabel label="mix">
          <Knob
            value={uiTheme.boardBgMix}
            onChange={(v) => patchUiTheme({ boardBgMix: v })}
          />
        </UpperLabel>
      </div>
      <div className="flex-ha gap-4">
        <h3 className={styles.header}>Graph</h3>
        <UpperLabel label="color">
          <ColorEditButton
            color={uiTheme.graphBgColor}
            onChange={(v) => patchUiTheme({ graphBgColor: v })}
          />
        </UpperLabel>
        <UpperLabel label="alpha">
          <Knob
            value={uiTheme.graphBgOpacity}
            onChange={(v) => patchUiTheme({ graphBgOpacity: v })}
          />
        </UpperLabel>
      </div>
      <div className="flex-ha gap-4">
        <h3 className={styles.header}>Title Bar</h3>
        <ColorEditButton
          color={uiTheme.titleBarBg}
          onChange={(v) => patchUiTheme({ titleBarBg: v })}
        />
      </div>
      <div className="flex-ha gap-4">
        <h3 className={styles.header}>Desk Area</h3>
        <ColorEditButton
          color={uiTheme.deskAreaBg}
          onChange={(v) => patchUiTheme({ deskAreaBg: v })}
        />
      </div>
    </div>
  );
};

export const SettingsContent_Theme = () => {
  return (
    <div className="flex-v gap-3 pt-2">
      <PresetSelector />
      <ThemeEditContents />
    </div>
  );
};
