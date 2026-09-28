import { useAppContext } from "./app-context";

export const SideControlBar = () => {
  const { store } = useAppContext();
  const styles = {
    wButton: "w-30px h-30px flex-c bd-white",
    button: "bd-white p-3 cursor-pointer",
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
          <button className={styles.button}>&lt;</button>
          <button className={styles.button}>&gt;</button>
        </div>
        <div className="h-140px" />
      </div>
    </div>
  );
};
