import { Icons } from "@/common/icons";
import { ColorEditButton } from "@/components/color-edit-button";
import { Knob } from "@/components/knob";
import { UpperLabel } from "@/components/upper-label";
import { autoPersistenceTask } from "@/periphery/auto-persistence-task";
import { store } from "@/store/store";
import { IconButton } from "@/views/settings/components/icon-button";
import { loadLocalImageFile } from "@/views/settings/local-image-file-loader";

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
};

export const SettingsContent_Theme = () => {
  const { uiTheme } = store.useSnapshot();
  const { patchUiTheme } = store;

  const styles = {
    header: "text-sm font-500 text-white bg-#aaa w-60px h-30px flex-c",
  };

  return (
    <div className="flex-v gap-3">
      <div className="flex-ha pt-3 gap-4">
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
      <div className="flex-ha pt-3 gap-4">
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
    </div>
  );
};
