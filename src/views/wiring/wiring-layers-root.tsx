import { AutomationSwitcherContainer } from "@/views/wiring/wire-automation-switchers";
import { WiringLayer } from "@/views/wiring/wiring-layer";
import { WireKnobContainer } from "@/views/wiring/wire-knobs";
import { splitConnectionKey } from "@/domain/port-helpers";
import { store } from "@/store/store";
import { WireArrow } from "@/views/wiring/wire-arrow";

const WiringLayerForegroundParts = () => {
  const { wireConnectionKeys, portStuffs } = store.useSnapshot();
  return (
    <>
      {wireConnectionKeys.map((connectionKey) => {
        const [sourcePortKey] = splitConnectionKey(connectionKey);
        const sourcePortStuff = portStuffs[sourcePortKey];
        const sourceSubType = sourcePortStuff?.subtype;
        if (sourceSubType === "audio") {
          return (
            <WireKnobContainer
              key={connectionKey}
              connectionKey={connectionKey}
            />
          );
        } else if (sourceSubType === "note") {
          return (
            <WireArrow key={connectionKey} connectionKey={connectionKey} />
          );
        } else if (sourceSubType === "automation") {
          return (
            <AutomationSwitcherContainer
              key={connectionKey}
              connectionKey={connectionKey}
            />
          );
        }
      })}
    </>
  );
};

export const WiringLayersRoot = () => {
  return (
    <>
      <WiringLayer />
      <WiringLayerForegroundParts />
    </>
  );
};
