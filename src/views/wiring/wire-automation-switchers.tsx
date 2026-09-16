import { setOrDeleteValue } from "@lib/utils/array-object-helper";
import { cz } from "@lib/utils/cz";
import { decodeWireConnectionKey } from "@/domain/port-helpers";
import { store } from "@/store/store";
import { wireGetters } from "@/store/wire-getters";
import { useWireMiddlePoint } from "@/views/wiring/wire-view-helpers";

const AutomationSwitcherContainer = ({
  connectionKey,
}: {
  connectionKey: string;
}) => {
  const {
    portStuffs,
    unitStuffs,
    configTargetWireKey,
    wireAutomationParameterIds,
  } = store.useSnapshot();
  const pos = useWireMiddlePoint(connectionKey);
  if (!pos) return;
  const d = decodeWireConnectionKey(connectionKey);
  const destinationPort = portStuffs[d.destinationPortKey];
  const unitStuff = unitStuffs[destinationPort?.unitId];
  const automationParameterSpecs = unitStuff?.automationParameterSpecs;
  if (!automationParameterSpecs) return;

  const currentParameterId = wireAutomationParameterIds[connectionKey];

  const setParameterId = (id: string | null) => {
    store.produceWireAutomationParameterIds((draft) => {
      setOrDeleteValue(draft, connectionKey, id);
    });
  };

  const isConfigTarget = configTargetWireKey === connectionKey;

  const onAnchorClick = () => {
    store.setConfigTargetWireKey(isConfigTarget ? null : connectionKey);
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="relative">
        <div className="w-3 h-3 bg-red-500" onClick={onAnchorClick} />
      </div>
      {isConfigTarget && (
        <>
          <div
            className={cz(!currentParameterId && "bg-blue-500")}
            onClick={() => setParameterId(null)}
          >
            --
          </div>
          {automationParameterSpecs.map((spec) => (
            <div
              key={spec.id}
              className={cz(spec.id === currentParameterId && "bg-blue-500")}
              onClick={() => setParameterId(spec.id)}
            >
              {spec.id}
            </div>
          ))}
        </>
      )}
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
