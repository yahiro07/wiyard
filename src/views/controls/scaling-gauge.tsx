import { appConfig } from "@/common/app-config";
import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { cz } from "@lib/utils/cz";
import { startDragSession } from "@lib/utils/drag-session";
import { clampValue } from "@lib/utils/number-helper";

const handleScalingGaugePointerDown = (e: React.PointerEvent) => {
  const originalSight = store.state.sight;
  startDragSession(e.nativeEvent, {
    onMove(_, delta) {
      const deltaY = delta.y;
      const newScaling = clampValue(
        originalSight.eyeScaling - deltaY / 100,
        appConfig.minScaling,
        appConfig.maxScaling,
      );
      const scaleDiff = newScaling / originalSight.eyeScaling;
      store.patchSight({
        eyeScaling: newScaling,
        eyeOffset: {
          x: originalSight.eyeOffset.x * scaleDiff,
          y: originalSight.eyeOffset.y * scaleDiff,
        },
      });
    },
  });
  e.stopPropagation();
  e.preventDefault();
};

export const ScalingGaugeContainer = () => {
  const { sight } = store.useSnapshot();
  const scaling = sight.eyeScaling;
  return (
    <div
      className={cz(
        "w-36px h-90px bg-#909098 flex-va justify-between rounded-3px",
        "text-white cursor-pointer hover:opacity-90",
      )}
      onPointerDown={handleScalingGaugePointerDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div>↑</div>
      <div className="relative flex-vc">
        <Icons.Zoom />
        <div className="text-8px">{Math.round(scaling * 100)}%</div>
      </div>
      <div>↓</div>
    </div>
  );
};
