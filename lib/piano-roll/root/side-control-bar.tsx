export const SideControlBar = () => {
  const styles = {
    wButton: "w-30px h-30px flex-c bd-white",
    button: "bd-white p-3 cursor-pointer",
  };
  return (
    <div className="w-80px h-full">
      <div className="flex-vc gap-6 h-full justify-between">
        <div className="flex-v gap-1">
          <button className={styles.wButton}>m</button>
          <button className={styles.wButton}>2</button>
          <button className={styles.wButton}>4</button>
          <button className={styles.wButton}>8</button>
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
