import { wireColors } from "@/common/appearance";
import { ArcKnob } from "@/components/arc-knob";
import { ArcSliderH } from "@/components/arc-slider";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { WireArrow } from "@/views/wiring/wire-arrow";
import { useWireMiddlePoint } from "@/views/wiring/wire-view-helpers";
import { cz } from "@lib/utils/cz";
import { renderLog } from "@lib/utils/render-log";

export const WireKnobContainer = ({
  connectionKey,
}: {
  connectionKey: string;
}) => {
  const { wireGains, wirePans, settings } = store.useSnapshot();
  const pos = useWireMiddlePoint(connectionKey);
  if (!pos) return;
  renderLog("WireKnobContainer", connectionKey);

  const showAlways = settings.wireVolumeKnobs;

  const gainValue = wireGains[connectionKey] ?? 0.5;
  const panValue = wirePans[connectionKey] ?? 0;
  return (
    <>
      <WireArrow connectionKey={connectionKey} />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }}
      >
        <div className={cz("w-40px h-40px")}>
          <div
            className={cz(
              "absolute top-0 left-0 w-full",
              !showAlways && "opacity-0 hover:opacity-100 active:opacity-100",
            )}
          >
            <div className="w-full h-40px flex-c">
              <ArcKnob
                value={gainValue}
                onChange={(v) => actions.setWireGain(connectionKey, v)}
                onTap={() => actions.setWireGain(connectionKey, 0.5)}
                color={wireColors.audio}
                size={36}
              />
            </div>
            <div className="w-full flex-c -mt-1">
              <ArcSliderH
                value={panValue}
                onChange={(v) => actions.setWirePan(connectionKey, v)}
                onTap={() => actions.setWirePan(connectionKey, 0)}
                color={wireColors.audio}
                size={32}
                min={-1}
                max={1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
