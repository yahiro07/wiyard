import { clampValue } from "@lib/utils/number-helper";
import { useAppContext } from "./app-context";

export const SideControlBar = () => {
  const { store } = useAppContext();
  const styles = {
    wButton: "w-30px h-30px flex-c bd-white",
    button: "bd-white p-3 cursor-pointer",
  };
  const shiftXBarPosition = (dir: number) => {
    const { sight } = store.state;
    const xBarPosition = clampValue(
      sight.xBarPosition + dir * sight.wBars,
      0,
      16 - sight.wBars,
    );
    store.patchSight({ xBarPosition });
  };
  return (
    <div className="h-full">
      <div className="flex-vc gap-6 h-full justify-between">
        <div className="flex-v gap-1">
          <button className={styles.wButton}>m</button>
          <button
            className={styles.wButton}
            onClick={() => store.patchSight({ wBars: 2 })}
          >
            2
          </button>
          <button
            className={styles.wButton}
            onClick={() => store.patchSight({ wBars: 4 })}
          >
            4
          </button>
          <button
            className={styles.wButton}
            onClick={() => store.patchSight({ wBars: 8 })}
          >
            8
          </button>
        </div>
        <div className="flex-v gap-2">
          <button
            className={styles.button}
            onClick={() => shiftXBarPosition(-1)}
          >
            &lt;
          </button>
          <button
            className={styles.button}
            onClick={() => shiftXBarPosition(1)}
          >
            &gt;
          </button>
        </div>
        <div className="h-140px" />
      </div>
    </div>
  );
};
