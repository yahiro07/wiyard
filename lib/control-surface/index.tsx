import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { seqNumbers } from "../utils/number-helper";
import { cz } from "../utils/cz";
import { MessageFromUnit } from "../contract";

type ChannelId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6" | "ch7" | "ch8";

function getChannelId(index: number): ChannelId {
  return `ch${index + 1}` as ChannelId;
}

const store = createStore<{
  activeChannelFlags: Record<ChannelId, boolean>;
}>({
  activeChannelFlags: {
    ch1: false,
    ch2: false,
    ch3: false,
    ch4: false,
    ch5: false,
    ch6: false,
    ch7: false,
    ch8: false,
  },
});

const App = () => {
  const { activeChannelFlags } = store.useSnapshot();
  return (
    <div className="bg-#ccc p-3 flex-vc gap-2">
      <h3>Control Surface</h3>
      <div className="flex-h">
        {seqNumbers(8).map((ch) => {
          const channelId = getChannelId(ch);
          const active = activeChannelFlags[channelId];
          return (
            <div
              key={ch}
              className={cz("w-100px h-100px bg-#666", active && "bg-#f088")}
              onClick={() => {
                store.patchActiveChannelFlags({ [channelId]: !active });
              }}
            >
              {channelId}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const createControlSurfaceUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const outputPorts = seqNumbers(8).map((i) => {
    const channelId = getChannelId(i);
    return unitInterface.createAutomationOutputPort(
      channelId,
      (i + 1).toString(),
    );
  });
  const timerId = setInterval(() => {
    for (const port of outputPorts) {
      port.emitValue(Math.random());
    }
  }, 1000);
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    cleanup() {
      clearInterval(timerId);
    },
  });
  store.subscribe(({ activeChannelFlags }) => {
    if (activeChannelFlags) {
      unitInterface.sendMessageToHost({
        type: "setAutomationOutputPortsOptInFlags",
        flags: activeChannelFlags,
      } satisfies MessageFromUnit);
    }
  }, true);
  return {
    RenderUi() {
      return <App />;
    },
  };
};
