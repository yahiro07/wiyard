import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { seqNumbers } from "../utils/number-helper";
import { cz } from "../utils/cz";
import { MessageFromUnit, MessageToUnit } from "../contract";
import { useEffect } from "react";
import { Knob } from "./knob";

type SlotId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6" | "ch7" | "ch8";

function getSlotId(index: number): SlotId {
  return `ch${index + 1}` as SlotId;
}
// const allChannelIds: ChannelId[] = seqNumbers(8).map(getChannelId);

type ParameterSlot = {
  id: SlotId;
  enabled: boolean;
  value: number;
};

const allSlotIds: SlotId[] = seqNumbers(8).map(getSlotId);

const store = createStore<{
  parameterSlots: ParameterSlot[];
  // slotsIds: SlotId[];
  // slots: Record<SlotId, ParameterSlot>;
  wideLayout: boolean;
}>({
  // slotsIds: allSlotIds,
  // slots: Object.fromEntries(
  //   allSlotIds.map((id) => [id, { id, enabled: id === "ch1", value: 0.5 }]),
  // ) as Record<SlotId, ParameterSlot>,
  parameterSlots: seqNumbers(8).map((i) => ({
    id: getSlotId(i),
    enabled: false,
    value: 0.5,
  })),
  wideLayout: false,
});

const actionsInternal = {
  patchSlot(slotId: SlotId, attrs: Partial<ParameterSlot>) {
    // store.patchSlots((prev) => ({ [slotId]: { ...prev[slotId], ...attrs } }));
    store.setParameterSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, ...attrs } : slot)),
    );
  },
};

const actions = {
  setParameter(slotId: SlotId, value: number) {
    actionsInternal.patchSlot(slotId, { value });
  },
  setSlotEnabled(slotId: SlotId, enabled: boolean) {
    actionsInternal.patchSlot(slotId, { enabled });
  },
};

const ControlCell = ({ slot }: { slot: ParameterSlot }) => {
  return (
    <div className={cz("w-100px h-100px bg-#ddd rounded-4px relative flex-c")}>
      <div className="absolute top-0 left-0 mx-1 my-0.5 text-sm">
        {slot.id.replace("ch", "")}
      </div>
      {slot.enabled ? (
        <>
          <Knob
            value={slot.value}
            onChange={(v) => actions.setParameter(slot.id, v)}
          />
          <div
            className="absolute top-0 right-0 mx-1 my-0.5 text-sm"
            onClick={() => actions.setSlotEnabled(slot.id, false)}
          >
            x
          </div>
          <div
            className="absolute bottom-0 right-0 mx-1 my-0.5 text-sm"
            onClick={() => actions.setSlotEnabled(slot.id, false)}
          >
            cc
          </div>
        </>
      ) : (
        <div onClick={() => actions.setSlotEnabled(slot.id, true)}>+</div>
      )}
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
  // const { slotsIds, slots } = store.useSnapshot();
  const { parameterSlots } = store.useSnapshot();
  return (
    <div className="flex-h gap-1">
      {parameterSlots.slice(offset, offset + count).map((slot) => (
        <ControlCell key={slot.id} slot={slot} />
      ))}
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
    <div className="bg-#f0f0f0 p-4 flex-vc gap-2 text-#333">
      <div className="w-full flex-h justify-between">
        <div />
        <LayoutSwitcherButton />
      </div>
      {!wideLayout && (
        <div className="flex-v gap-1">
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
  const outputPorts = allSlotIds.map((id) => {
    return unitInterface.createAutomationOutputPort(id, id.replace("ch", ""));
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

  let activeChannelsCode = "";

  function buildActiveChannelFlags() {
    return Object.fromEntries(
      store.state.parameterSlots.map((slot) => [slot.id, slot.enabled]),
    );
  }

  const setupSynchronization = () => {
    // console.log("CS setupSynchronization");
    return store.subscribe(({ parameterSlots, wideLayout }) => {
      if (parameterSlots) {
        const nextActiveChannelsCode = parameterSlots
          .map((slot) => (slot.enabled ? 1 : 0))
          .join("");
        if (nextActiveChannelsCode !== activeChannelsCode) {
          const activeChannelFlags = buildActiveChannelFlags();
          queueMicrotask(() => {
            // console.log("CS sendMessageToHost", activeChannelFlags);
            unitInterface.sendMessageToHost({
              type: "setAutomationOutputPortsOptInFlags",
              flags: activeChannelFlags,
            } satisfies MessageFromUnit);
          });
          activeChannelsCode = nextActiveChannelsCode;
        }
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
