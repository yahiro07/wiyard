import { store } from "@/store/store";
import { wireGetters } from "@/store/wire-getters";
import { useWireMiddlePoint } from "@/views/wiring/wire-view-helpers";

const AutomationSwitcherContainer = ({
  connectionKey,
}: {
  connectionKey: string;
}) => {
  const { wireGains, portStuffs } = store.useSnapshot();
  const pos = useWireMiddlePoint(connectionKey);
  if (!pos) return;
  const value = wireGains[connectionKey] ?? 0.5;
  const [_, destinationPortKey] = connectionKey.split("-");
  const destinationPort = portStuffs[destinationPortKey];

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.x, top: pos.y }}
    >
      aaa
    </div>
  );
};

export const WireAutomationSwitchersRoot = () => {
  const connectionKeys =
    wireGetters.useBoardUnitSubtypedConnectionKeys("automation");
  return (
    <div>
      {connectionKeys.map((key) => (
        <AutomationSwitcherContainer key={key} connectionKey={key} />
      ))}
    </div>
  );
};
