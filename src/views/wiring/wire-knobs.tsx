import { wireColors } from "@/common/appearance";
import { ArcKnob } from "@/components/arc-knob";
import { Knob } from "@/components/knob";
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
  const { wireGains, settings } = store.useSnapshot();
  const pos = useWireMiddlePoint(connectionKey);
  if (!pos) return;
  renderLog("WireKnobContainer", connectionKey);

  const gainValue = wireGains[connectionKey] ?? 0.5;
  if (!settings.wireVolumeKnobs) return;

  return (
    <>
      <WireArrow connectionKey={connectionKey} />
      {
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pos.x, top: pos.y }}
        >
          <div className={cz("w-40px h-40px")}>
            <div
              className={cz(
                "absolute top-0 left-0 w-full",
                "opacity-0 hover:opacity-100 active:opacity-100",
              )}
            >
              <div className="w-full h-40px flex-c">
                {1 ? (
                  <ArcKnob
                    value={gainValue}
                    onChange={(v) => actions.setWireGain(connectionKey, v)}
                    color={wireColors.audio}
                    size={32}
                  />
                ) : (
                  <Knob
                    value={gainValue}
                    onChange={(v) => actions.setWireGain(connectionKey, v)}
                    size={24}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};
