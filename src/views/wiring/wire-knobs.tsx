import { vectorOp } from "@lib/utils/geometry-helper";
import { Knob } from "@/components/knob";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { wireGetters } from "@/store/wire-getters";

const WireKnobContainer = ({
  wireConnectionKey,
}: {
  wireConnectionKey: string;
}) => {
  const { portStuffs, wireGains } = store.useSnapshot();
  const [sourcePortKey, destinationPortKey] = wireConnectionKey.split("-");
  const sourcePort = portStuffs[sourcePortKey];
  const destPort = portStuffs[destinationPortKey];
  if (!(sourcePort && destPort)) return null;
  const p0 = sourcePort.position;
  const p1 = destPort.position;
  const pos = vectorOp.middle(p0, p1);
  const value = wireGains[wireConnectionKey] ?? 0.5;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.x, top: pos.y }}
    >
      <Knob
        value={value}
        onChange={(v) => actions.setWireGain(wireConnectionKey, v)}
      />
    </div>
  );
};

export const WireKnobsRoot = () => {
  const audioConnectionKeys = wireGetters.useBoardUnitAudioConnectionKeys();
  return (
    <div>
      {audioConnectionKeys.map((key) => (
        <WireKnobContainer key={key} wireConnectionKey={key} />
      ))}
    </div>
  );
};
