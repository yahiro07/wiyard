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

const allSlotIds: SlotId[] = seqNumbers(8).map(getSlotId);

type ParameterSlot = {
  id: SlotId;
  enabled: boolean;
  value: number;
  ccNumber: number | null;
};

const store = createStore<{
  parameterSlots: ParameterSlot[];
  wideLayout: boolean;
  controlChangeAssignTargetSlotId: SlotId | null;
}>({
  parameterSlots: seqNumbers(8).map((i) => ({
    id: getSlotId(i),
    enabled: i === 0,
    value: 0.5,
    ccNumber: null,
  })),
  wideLayout: false,
  controlChangeAssignTargetSlotId: null,
});

const actionsInternal = {
  patchSlot(slotId: SlotId, attrs: Partial<ParameterSlot>) {
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
  setControlChangeAssignTarget(slotId: SlotId | null) {
    store.setControlChangeAssignTargetSlotId(slotId);
  },
  assignControlChange(slotId: SlotId, ccNumber: number) {
    const currentAssignedSlot = store.state.parameterSlots.find(
      (slot) => slot.ccNumber === ccNumber,
    );
    if (currentAssignedSlot) {
      actionsInternal.patchSlot(currentAssignedSlot.id, { ccNumber: null });
    }
    actionsInternal.patchSlot(slotId, { ccNumber });
  },
  clearControlChangeAssignTarget() {
    store.setControlChangeAssignTargetSlotId(null);
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
            className="absolute bottom-0 right-0 mx-1 my-0.5 text-11px"
            onClick={() => actions.setControlChangeAssignTarget(slot.id)}
          >
            {slot.ccNumber ? `CC#${slot.ccNumber}` : "CC"}
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

const KnobsArea = () => {
  const { wideLayout } = store.useSnapshot();
  return (
    <div>
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

const ControlChangeAssignDialog = () => {
  return (
    <div
      className="absolute-full flex-c"
      onClick={actions.clearControlChangeAssignTarget}
    >
      <div className="bg-#fffd p-6">
        <div>touch knob to assign control change</div>
      </div>
    </div>
  );
};

const ControlChangeAssignDialogContainer = () => {
  const { controlChangeAssignTargetSlotId } = store.useSnapshot();
  if (!controlChangeAssignTargetSlotId) return;
  return <ControlChangeAssignDialog />;
};

const App = () => {
  return (
    <div className="bg-#f0f0f0 p-4 flex-vc gap-2 text-#333 relative">
      <div className="w-full flex-h justify-between">
        <div />
        <LayoutSwitcherButton />
      </div>
      <KnobsArea />
      <ControlChangeAssignDialogContainer />
    </div>
  );
};

export const createControlSurfaceUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const outputPorts = allSlotIds.map((id) => {
    return unitInterface.createAutomationOutputPort(id, id.replace("ch", ""));
  });
  // console.log("CS completeSetup");
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    unitCallbacks: {
      onMessageFromHost(message: MessageToUnit) {
        // console.log("CS onMessageFromHost", message);
        if (message.type === "controlChange") {
          const { controlNumber, value } = message;
          console.log("CS control change received", controlNumber, value);
          const targetSlotId = store.state.controlChangeAssignTargetSlotId;
          if (targetSlotId) {
            actions.assignControlChange(targetSlotId, controlNumber);
            actions.clearControlChangeAssignTarget();
          }
        }
      },
    },
  });

  let activeChannelsCode = "";
  const sentValues: { [key in SlotId]?: number } = {};

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
        for (let i = 0; i < parameterSlots.length; i++) {
          const slot = parameterSlots[i];
          if (slot.value !== sentValues[slot.id]) {
            outputPorts[i].emitValue(slot.value);
            sentValues[slot.id] = slot.value;
          }
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
