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

  const showAlways = settings.wireVolumeKnobs;

  const value = wireGains[connectionKey] ?? 0.5;
  return (
    <>
      <WireArrow connectionKey={connectionKey} />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }}
      >
        <div className={cz("w-50px h-50px bd-red")}>
          <div
            className={cz(
              "absolute-full flex-c",
              !showAlways && "opacity-30 hover:opacity-100 active:opacity-100",
            )}
          >
            <Knob
              value={value}
              onChange={(v) => actions.setWireGain(connectionKey, v)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
