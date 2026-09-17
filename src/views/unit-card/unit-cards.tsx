import { cz } from "@lib/utils/cz";
import { IconType } from "react-icons";
import { Icons } from "@/common/icons";
import { BoardUnitItem, UnitItem, UnitPortSpec } from "@/domain/types";
import { catalog, internalUnitCardIcons } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { unitCardHandlers } from "@/views/unit-card/unit-card-handlers";
import { useUnitCardPortPositionManager } from "@/views/unit-card/unit-card-port-position-manager";
import { UnitPortsColumn } from "@/views/unit-card/unit-ports";
import { AutomationEditorUnitCardRoot } from "@/views/unit-card/automation-editor-unit-card";

function useUnitStuff(unitId: string) {
  const { unitStuffs } = store.useSnapshot();
  return unitStuffs[unitId];
}

const UnitCardOperationOverlay = ({ unitItem }: { unitItem: UnitItem }) => {
  return (
    <div
      className="absolute-full bg-black/30"
      onPointerDown={(e) => {
        actions.setMenuTargetUnit(null);
        e.stopPropagation();
      }}
    >
      <div className="flex justify-end">
        <button
          className="mx-1 my-1.5 cursor-pointer"
          type="button"
          onPointerDown={(e) => {
            actions.removeUnit(unitItem.unitId);
            e.stopPropagation();
          }}
        >
          <Icons.Trash size={24} />
        </button>
      </div>
    </div>
  );
};

const BoardUnitCard = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const { menuTargetUnitId } = store.useSnapshot();
  const isMenuTarget = menuTargetUnitId === unitItem.unitId;
  const unitStuff = useUnitStuff(unitItem.unitId);
  const portPositionManager = useUnitCardPortPositionManager(unitItem);
  const catalogItem = catalog[unitItem.catalogKey];
  const inputPortSpecs = unitStuff?.inputPortSpecs;
  const outputPortSpecs = unitStuff?.outputPortSpecs;

  return (
    <div
      ref={portPositionManager.setBaseElement}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div className="flex-ha">
        {inputPortSpecs && (
          <UnitPortsColumn
            portSpecs={inputPortSpecs}
            portPositionManager={portPositionManager}
          />
        )}
        <div
          className="h-100px bg-white cursor-pointer relative shadow-md"
          onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
        >
          <img
            src={catalogItem.thumbnailUrl}
            className="h-full object-contain"
            alt={catalogItem.name}
          />
          {isMenuTarget && <UnitCardOperationOverlay unitItem={unitItem} />}
        </div>
        {outputPortSpecs && (
          <UnitPortsColumn
            portSpecs={outputPortSpecs}
            portPositionManager={portPositionManager}
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-22px">
        <div className="flex-c text-sm">{catalogItem.name}</div>
      </div>
    </div>
  );
};

const EdgeUnitCardView = ({
  unitItem,
  inputPortSpecs,
  outputPortSpecs,
  highlighted,
  iconComponent: IconComponent,
  label,
  handlePointerDown,
}: {
  unitItem: UnitItem;
  inputPortSpecs?: UnitPortSpec[];
  outputPortSpecs?: UnitPortSpec[];
  highlighted: boolean;
  iconComponent: IconType;
  label: string;
  handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) => {
  const isNoteInputPort = unitItem.type === "noteInput";
  const portPositionManager = useUnitCardPortPositionManager(unitItem);
  return (
    <div
      ref={portPositionManager.setBaseElement}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div className="flex-ha">
        {inputPortSpecs && (
          <UnitPortsColumn
            portSpecs={inputPortSpecs}
            portPositionManager={portPositionManager}
          />
        )}
        <div
          className={cz(
            "w-90px h-90px bg-white/10 flex-c relative shadow-md",
            isNoteInputPort &&
              "border-l border-l-6 border-l-transparent cursor-pointer",
            highlighted && "!border-l-#8ae",
          )}
          onPointerDown={handlePointerDown}
        >
          <IconComponent size={50} className="mb-3" />
          {label && (
            <div className="absolute-full flex-va justify-end text-[13px] font-500 pb-1">
              {label}
            </div>
          )}
        </div>
        {outputPortSpecs && (
          <UnitPortsColumn
            portSpecs={outputPortSpecs}
            portPositionManager={portPositionManager}
          />
        )}
      </div>
    </div>
  );
};

const EdgeUnitCard_NoteInputPort = ({ unitItem }: { unitItem: UnitItem }) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  const { currentNoteChannelId } = store.useSnapshot();
  const notePortIndex = notePortGetters.useNoteInputPortIndex(unitItem.unitId);
  const isCurrent = unitItem.unitId === currentNoteChannelId;
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      inputPortSpecs={[]}
      outputPortSpecs={unitStuff?.outputPortSpecs}
      highlighted={isCurrent}
      label={`input ${notePortIndex + 1}`}
      iconComponent={internalUnitCardIcons.noteInputPort}
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};

const EdgeUnitCard_SpeakerPort = ({ unitItem }: { unitItem: UnitItem }) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      inputPortSpecs={unitStuff?.inputPortSpecs}
      outputPortSpecs={[]}
      highlighted={false}
      iconComponent={internalUnitCardIcons.speakerPort}
      label="output"
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};

const UnitCardRoot = ({ unitItem }: { unitItem: UnitItem }) => {
  if (unitItem.type === "board") {
    return <BoardUnitCard unitItem={unitItem} />;
  } else if (unitItem.type === "noteInput") {
    return <EdgeUnitCard_NoteInputPort unitItem={unitItem} />;
  } else if (unitItem.type === "speaker") {
    return <EdgeUnitCard_SpeakerPort unitItem={unitItem} />;
  }
};

export const UnitCardsRoot = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <>
      {unitItems.map((item) => (
        <UnitCardRoot key={item.unitId} unitItem={item} />
      ))}
      <AutomationEditorUnitCardRoot />
    </>
  );
};
