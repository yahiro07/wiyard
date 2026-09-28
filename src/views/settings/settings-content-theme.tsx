import { Knob } from "@/components/knob";
import { UpperLabel } from "@/components/upper-label";
import { store } from "@/store/store";

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
        <UpperLabel label="mix">
          <Knob
            value={uiTheme.boardBgMix}
            onChange={(v) => patchUiTheme({ boardBgMix: v })}
          />
        </UpperLabel>
      </div>
      <div className="flex-ha pt-3 gap-4">
        <h3 className={styles.header}>Graph</h3>
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
