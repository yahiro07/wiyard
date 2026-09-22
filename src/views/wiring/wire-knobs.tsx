import { Knob } from "@/components/knob";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { wireGetters } from "@/store/wire-getters";
import { useWireMiddlePoint } from "@/views/wiring/wire-view-helpers";
import { renderLog } from "@lib/utils/render-log";

const WireKnobContainer = ({ connectionKey }: { connectionKey: string }) => {
  const { wireGains } = store.useSnapshot();
  const pos = useWireMiddlePoint(connectionKey);
  if (!pos) return;
  renderLog("WireKnobContainer", connectionKey);

  const value = wireGains[connectionKey] ?? 0.5;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.x, top: pos.y }}
    >
      <Knob
        value={value}
        onChange={(v) => actions.setWireGain(connectionKey, v)}
      />
    </div>
  );
};

export const WireKnobsRoot = () => {
  const connectionKeys =
    wireGetters.useBoardUnitSubtypedConnectionKeys("audio");
  return (
    <div>
      {connectionKeys.map((key) => (
        <WireKnobContainer key={key} connectionKey={key} />
      ))}
    </div>
  );
};
