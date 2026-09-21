import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { seqNumbers } from "../utils/number-helper";
import { cz } from "../utils/cz";
import { MessageFromUnit, MessageToUnit } from "../contract";
import { useEffect } from "react";
import { Knob } from "./knob";
import { IconType } from "react-icons";
import { pickObjectMembers } from "../utils/array-object-helper";
import { Icons } from "./icons";

type SlotId = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6" | "ch7" | "ch8";

function getSlotId(index: number): SlotId {
  return `ch${index + 1}` as SlotId;
}

const allSlotIds: SlotId[] = seqNumbers(8).map(getSlotId);

type ParameterSlot = {
  id: SlotId;
  enabled: boolean;
  value: number;
};

const store = createStore<{
  //saved in project data
  parameterSlots: ParameterSlot[];
  wideLayout: boolean;
  assignsFixed: boolean;
  //
  //persisted in session data
  controlChangeAssignMap: { [key in SlotId]?: number };
  //
  destinationParameterPathsMap: { [key in SlotId]?: string[] };
  controlChangeAssignTargetSlotId: SlotId | null;
  draggingSlotId: SlotId | null;
}>({
  parameterSlots: seqNumbers(8).map((i) => ({
    id: getSlotId(i),
    enabled: false,
    value: 0.5,
  })),
  wideLayout: false,
  assignsFixed: false,
  controlChangeAssignMap: {},
  destinationParameterPathsMap: {},
  controlChangeAssignTargetSlotId: null,
  draggingSlotId: null,
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
  assignControlChange(slotId: SlotId, ccNumber: number | null) {
    const newMap = { ...store.state.controlChangeAssignMap };
    if (ccNumber !== null) {
      const unassignedSlotId = allSlotIds.find((id) => newMap[id] === ccNumber);
      if (unassignedSlotId) {
        delete newMap[unassignedSlotId];
      }
      newMap[slotId] = ccNumber;
    } else {
      delete newMap[slotId];
    }
    store.setControlChangeAssignMap(newMap);
  },
  clearControlChangeAssignTarget() {
    store.setControlChangeAssignTargetSlotId(null);
  },
  toggleLayout() {
    store.toggleWideLayout();
  },
  setAssignsFixed(assignsFixed: boolean) {
    store.setAssignsFixed(assignsFixed);
  },
  toggleAssignsFixed() {
    store.toggleAssignsFixed();
  },
  setDraggingSlotId(slotId: SlotId | null) {
    store.setDraggingSlotId(slotId);
  },
  removeCurrentControlTargetAssignment() {
    const targetId = store.state.controlChangeAssignTargetSlotId;
    if (targetId) {
      actions.assignControlChange(targetId, null);
    }
  },
};

const IconButton = ({
  className,
  icon: IconComponent,
  size = 20,
  active,
  onClick,
}: {
  className?: string;
  icon: IconType;
  size?: number;
  active?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={cz("cursor-pointer", active && "text-#8ae", className)}
      onClick={onClick}
    >
      <IconComponent size={size} />
    </button>
  );
};

const ControlCell = ({ slot }: { slot: ParameterSlot }) => {
  const { assignsFixed, controlChangeAssignMap } = store.useSnapshot();
  const slotCcNumber = controlChangeAssignMap[slot.id];

  const editing = !assignsFixed;

  return (
    <div className={cz("w-100px h-100px bg-#ddd rounded-4px relative flex-c")}>
      {(slot.enabled || editing) && (
        <div className="absolute top-0 left-0 mx-5px my-2px text-sm font-500">
          {slot.id.replace("ch", "")}
        </div>
      )}
      {slot.enabled ? (
        <>
          <Knob
            value={slot.value}
            onChange={(v) => actions.setParameter(slot.id, v)}
            onDragStart={() => actions.setDraggingSlotId(slot.id)}
            onDragEnd={() => actions.setDraggingSlotId(null)}
          />
          {editing && (
            <div className="absolute top-0 right-0 p-2px">
              <IconButton
                className="text-#666"
                icon={Icons.Close}
                onClick={() => actions.setSlotEnabled(slot.id, false)}
                size={18}
              />
            </div>
          )}
          {editing && (
            <div
              className="absolute bottom-0 right-0 mx-1 my-0.5 text-11px"
              onClick={() => actions.setControlChangeAssignTarget(slot.id)}
            >
              {slotCcNumber ? `CC#${slotCcNumber}` : "CC"}
            </div>
          )}
        </>
      ) : (
        <>
          {editing && (
            <IconButton
              className="text-#666"
              icon={Icons.Add}
              onClick={() => actions.setSlotEnabled(slot.id, true)}
              size={18}
            />
          )}
        </>
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
    <IconButton
      icon={Icons.Panorama}
      active={wideLayout}
      onClick={actions.toggleLayout}
    />
  );
};

const AssignsFixedSwitcherButtons = () => {
  const { assignsFixed } = store.useSnapshot();
  return (
    <div className="flex-h gap-1">
      <IconButton
        icon={Icons.Wrench}
        active={!assignsFixed}
        onClick={() => actions.setAssignsFixed(false)}
        size={17}
      />
      <IconButton
        icon={Icons.Shuttle}
        active={assignsFixed}
        onClick={() => actions.setAssignsFixed(true)}
      />
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
      <div className="bg-#fffd p-6 flex-vc gap-3">
        <div>Touch knob to assign control change</div>
        <div className="flex-ha gap-2">
          <div>or</div>
          <button
            className="bg-#ccc text-white p-1.5 cursor-pointer text-sm font-600"
            onClick={actions.removeCurrentControlTargetAssignment}
          >
            remove it
          </button>
        </div>
      </div>
    </div>
  );
};

const ControlChangeAssignDialogContainer = () => {
  const { controlChangeAssignTargetSlotId } = store.useSnapshot();
  if (!controlChangeAssignTargetSlotId) return;
  return <ControlChangeAssignDialog />;
};

const ParameterDetailDisplay = ({
  slot,
  destParameterPaths,
}: {
  slot: ParameterSlot;
  destParameterPaths: string[] | undefined;
}) => {
  return (
    <div
      className={cz(
        "flex-h overflow-hidden text-sm min-w-0 flex-1 h-20px",
        "[&>div]:(whitespace-nowrap)",
      )}
    >
      <div className="shrink-0">{slot.id.replace("ch", "")}</div>
      <div className="shrink-0 w-44px pl-3">{slot.value.toFixed(2)}</div>
      {destParameterPaths && (
        <>
          <div className="shrink-0 flex-c -mx-1">
            <Icons.ArrowRight size={24} />
          </div>
          <div className="min-w-0 flex-1 text-ellipsis overflow-hidden">
            {destParameterPaths.join(", ")}
          </div>
        </>
      )}
    </div>
  );
};

const ParameterDetailDisplayContainer = () => {
  const { parameterSlots, draggingSlotId, destinationParameterPathsMap } =
    store.useSnapshot();
  if (!draggingSlotId) return;
  const slot = parameterSlots.find((slot) => slot.id === draggingSlotId);
  if (!slot) return;
  const destParameterPaths = destinationParameterPathsMap[slot.id];
  return (
    <ParameterDetailDisplay
      slot={slot}
      destParameterPaths={destParameterPaths}
    />
  );
};

const TopArea = () => {
  return (
    <div className="w-full flex-h justify-between">
      <ParameterDetailDisplayContainer />
      <div className="w-4 shrink-0" />
      <div className="flex-h gap-5">
        <LayoutSwitcherButton />
        <AssignsFixedSwitcherButtons />
      </div>
    </div>
  );
};

const App = () => {
  const { wideLayout } = store.useSnapshot();
  return (
    <div
      className={cz(
        "bg-#f0f0f0 p-4 flex-vc gap-2 text-#444 relative",
        wideLayout ? "w-860px h-160px" : "w-444px h-264px",
      )}
    >
      <TopArea />
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
        if (message.type === "controlChange") {
          const { controlNumber, value } = message;
          const assignTargetSlotId =
            store.state.controlChangeAssignTargetSlotId;
          if (assignTargetSlotId) {
            actions.assignControlChange(assignTargetSlotId, controlNumber);
            actions.clearControlChangeAssignTarget();
          } else {
            for (const slot of store.state.parameterSlots) {
              const slotCcNumber = store.state.controlChangeAssignMap[slot.id];
              if (slotCcNumber === controlNumber) {
                actions.setParameter(slot.id, value);
              }
            }
          }
        } else if (message.type === "setDestinationParameterPaths") {
          store.setDestinationParameterPathsMap(
            message.destinationParameterPaths,
          );
        } else if (message.type === "emitSessionState") {
          const { controlChangeAssignMap } = store.state;
          return { controlChangeAssignMap };
        } else if (message.type === "applySessionState") {
          const { controlChangeAssignMap } = message.state;
          store.assign({ controlChangeAssignMap });
        }
      },
    },
    persistence: {
      emitState() {
        return pickObjectMembers(store.state, [
          "parameterSlots",
          "wideLayout",
          "assignsFixed",
        ]);
      },
      applyState(attrs) {
        store.assign(attrs);
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
    return store.subscribe(({ parameterSlots, wideLayout }) => {
      if (parameterSlots) {
        const nextActiveChannelsCode = parameterSlots
          .map((slot) => (slot.enabled ? 1 : 0))
          .join("");
        if (nextActiveChannelsCode !== activeChannelsCode) {
          const activeChannelFlags = buildActiveChannelFlags();
          queueMicrotask(() => {
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
          unitInterface.setViewSize({ width: 860, height: 160 });
        } else {
          unitInterface.setViewSize({ width: 444, height: 264 });
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
