import { setOrDeleteValue } from "@lib/utils/array-object-helper";
import { cz } from "@lib/utils/cz";
import { useHandleClickOutside } from "@lib/utils/use-handle-click-outside";
import { useRef } from "react";
import { AutomationParameterSpec } from "wafer-host/unit-types";
import { decodeWireConnectionKey } from "@/domain/port-helpers";
import { store } from "@/store/store";
import { wireGetters } from "@/store/wire-getters";
import { useWireMiddlePoint } from "@/views/wiring/wire-view-helpers";
import { wireColors } from "@/common/appearance";

const AutomationSwitcherMenu = ({
  currentParameterId,
  setParameterId,
  automationParameterSpecs,
}: {
  currentParameterId: string | null;
  setParameterId: (id: string | null) => void;
  automationParameterSpecs: AutomationParameterSpec[];
}) => {
  const closeMenu = () => store.setConfigTargetWireKey(null);

  const wrapSetParameterId = (id: string | null) => {
    setParameterId(id);
    closeMenu();
  };

  const baseDivRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(baseDivRef, closeMenu);
  return (
    <div ref={baseDivRef} className="flex-v bg-#777e p-2">
      <div
        className={cz(
          "cursor-pointer hover:bg-white/10",
          !currentParameterId && "!bg-#8af",
        )}
        onClick={() => wrapSetParameterId(null)}
      >
        --
      </div>
      {automationParameterSpecs.map((spec) => (
        <div
          key={spec.id}
          className={cz(
            "px-1 py-0.75 cursor-pointer hover:bg-white/10",
            spec.id === currentParameterId && "!bg-#8af",
          )}
          onClick={() => wrapSetParameterId(spec.id)}
        >
          {/* {i + 1}. */}
          {spec.id}
        </div>
      ))}
    </div>
  );
};

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
      className="absolute -translate-x-1/2 -translate-y-1/2 z-3"
      style={{ left: pos.x, top: pos.y }}
    >
      {!isConfigTarget && (
        <div
          className="w-6 h-6 flex-c cursor-pointer hover:opacity-80"
          onClick={onAnchorClick}
        >
          <div
            className="w-3 h-3"
            style={{ backgroundColor: wireColors.automation }}
          />
        </div>
      )}
      {isConfigTarget && (
        <AutomationSwitcherMenu
          currentParameterId={currentParameterId}
          setParameterId={setParameterId}
          automationParameterSpecs={automationParameterSpecs}
        />
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
