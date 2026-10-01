import { clampValue } from "@lib/utils/number-helper";
import { useAppContext } from "../model/app-context";
import { Icons } from "../components/icons";
import { cz } from "@lib/utils/cz";

const DisplayWidthControlButtons = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const styles = {
    wButton: cz(
      "w-30px h-30px flex-c",
      "bg-#999 text-xs",
      "cursor-pointer hover:opacity-80",
      "disabled:(opacity-50 pointer-events-none)",
      "[&.active]:bg-#8ae",
    ),
  };
  return (
    <div className="flex-v gap-2">
      <div className="flex-v gap-1">
        {[16, 8, 4, 2].map((b) => {
          const active = sight.wBars === b;
          return (
            <button
              key={b}
              className={cz(styles.wButton, active && "active")}
              onClick={() => store.patchSight({ wBars: b })}
            >
              {b}
            </button>
          );
        })}
      </div>
      <button
        className={cz(styles.wButton, sight.withXPadding && "active")}
        onClick={() => store.patchSight({ withXPadding: !sight.withXPadding })}
      >
        <Icons.LayoutSlider size={16} />
      </button>
    </div>
  );
};

const PageShiftButtons = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const styles = {
    shiftButton: cz(
      "w-36px h-76px flex-c",
      "bg-#999 text-xl",
      "cursor-pointer hover:opacity-80",
      "disabled:(opacity-50 pointer-events-none)",
    ),
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
    <div className="flex-v gap-2">
      <button
        className={styles.shiftButton}
        disabled={sight.xBarPosition === 0}
        onClick={() => shiftXBarPosition(-1)}
      >
        <Icons.CaretLeft />
      </button>
      <button
        className={styles.shiftButton}
        disabled={sight.xBarPosition === 16 - sight.wBars}
        onClick={() => shiftXBarPosition(1)}
      >
        <Icons.CaretRight />
      </button>
    </div>
  );
};

export const SideControlBar = () => {
  return (
    <div className="h-full">
      <div className="flex-vc gap-8 h-full">
        <DisplayWidthControlButtons />
        <PageShiftButtons />
        <div className="h-160px" />
      </div>
    </div>
  );
};
