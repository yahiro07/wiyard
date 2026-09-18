import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { seqNumbers } from "../utils/number-helper";
import { cz } from "../utils/cz";
import { MessageToUnit, MessageFromUnit } from "../contract";
import { useEffect } from "react";

type ChannelId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6" | "ch7" | "ch8";

function getChannelId(index: number): ChannelId {
  return `ch${index + 1}` as ChannelId;
}

const store = createStore<{
  activeChannelFlags: Record<ChannelId, boolean>;
  wideLayout: boolean;
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
  wideLayout: false,
});

const ControlCell = ({
  channelId,
  active,
}: {
  channelId: ChannelId;
  active: boolean;
}) => {
  return (
    <div
      className={cz("w-100px h-100px bg-#666", active && "bg-#f088")}
      onClick={() => {
        store.patchActiveChannelFlags({ [channelId]: !active });
      }}
    >
      {channelId}
    </div>
  );
};

const ControlCellsRow = ({
  offset,
  count,
}: {
  offset: number;
  count: number;
}) => {
  const { activeChannelFlags } = store.useSnapshot();
  return (
    <div className="flex-h">
      {seqNumbers(count).map((ch) => {
        const channelId = getChannelId(offset + ch);
        const active = activeChannelFlags[channelId];
        return <ControlCell channelId={channelId} active={active} />;
      })}
    </div>
  );
};

const LayoutSwitcherButton = () => {
  const { wideLayout } = store.useSnapshot();
  return (
    <div className="flex-h gap-1">
      <button
        className={cz(!wideLayout && "bg-#f088")}
        onClick={() => {
          store.setWideLayout(false);
        }}
      >
        4x2
      </button>
      <button
        className={cz(wideLayout && "bg-#f088")}
        onClick={() => {
          store.setWideLayout(true);
        }}
      >
        8x1
      </button>
    </div>
  );
};

const App = () => {
  const { wideLayout } = store.useSnapshot();
  return (
    <div className="bg-#ccc p-3 flex-vc gap-2">
      <div className="w-full flex-h justify-between">
        <h3>Control Surface</h3>
        <LayoutSwitcherButton />
      </div>
      {!wideLayout && (
        <div className="flex-v">
          <ControlCellsRow offset={0} count={4} />
          <ControlCellsRow offset={4} count={4} />
        </div>
      )}
      {wideLayout && <ControlCellsRow offset={0} count={8} />}
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
  // console.log("CS completeSetup");
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    cleanup() {
      clearInterval(timerId);
    },
    unitCallbacks: {
      onMessageFromHost(message: MessageToUnit) {
        // console.log("CS onMessageFromHost", message);
        if (message.type === "controlChange") {
          const { controlNumber, value } = message;
          console.log("CS control change received", controlNumber, value);
        }
      },
    },
  });

  const setupSynchronization = () => {
    // console.log("CS setupSynchronization");
    return store.subscribe(({ activeChannelFlags, wideLayout }) => {
      if (activeChannelFlags !== undefined) {
        queueMicrotask(() => {
          // console.log("CS sendMessageToHost", activeChannelFlags);
          unitInterface.sendMessageToHost({
            type: "setAutomationOutputPortsOptInFlags",
            flags: activeChannelFlags,
          } satisfies MessageFromUnit);
        });
      }
      if (wideLayout !== undefined) {
        if (wideLayout) {
          unitInterface.setViewSize(824, 156);
        } else {
          unitInterface.setViewSize(424, 256);
        }
      }
    }, true);
  };
  return {
    RenderUi() {
      useEffect(setupSynchronization, []);
      return <App />;
    },
  };
};
