import { IconType } from "react-icons";
import {
  BoardUnitItem,
  EdgeUnitItem,
  UnitItem,
  UnitPortSpec,
} from "@/domain/types";
import { catalog, internalUnitSpecs } from "@/domain/unit-entries";
import { unitCardHandlers } from "@/presenter/desk-area-handlers";
import { useUnitCardPortPositionManager } from "@/realms/unit-card/unit-card-port-position-manager";
import {
  useEdgeUnitCardStates_NoteInputPort,
  useUnitStuff,
} from "@/realms/unit-card/unit-cards-models";
import { UnitPortsColumn } from "@/realms/unit-card/unit-ports";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const BoardUnitCard = ({ unitItem }: { unitItem: BoardUnitItem }) => {
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
          className="h-100px bg-white cursor-pointer"
          onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
        >
          <img
            src={catalogItem.thumbnailUrl}
            className="w-full h-full object-contain"
            alt={catalogItem.name}
          />
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
  unitItem: EdgeUnitItem;
  inputPortSpecs?: UnitPortSpec[];
  outputPortSpecs?: UnitPortSpec[];
  highlighted: boolean;
  iconComponent: IconType;
  label: string;
  handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) => {
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
            "w-100px h-100px bg-white/50 flex-c cursor-pointer relative",
            "border-l border-l-6 border-l-transparent",
            highlighted && "!border-l-#8ae",
          )}
          onPointerDown={handlePointerDown}
        >
          <IconComponent size={55} className="mb-3" />
          {label && (
            <div className="absolute-full flex-va justify-end text-sm font-bold pb-1">
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

const EdgeUnitCard_NoteInputPort = ({
  unitItem,
}: {
  unitItem: EdgeUnitItem;
}) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  const { index, isCurrent } = useEdgeUnitCardStates_NoteInputPort(unitItem);
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      inputPortSpecs={[]}
      outputPortSpecs={unitStuff?.outputPortSpecs}
      highlighted={isCurrent}
      label={`input ${index + 1}`}
      iconComponent={internalUnitSpec.iconComponent}
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};

const EdgeUnitCard_SpeakerPort = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      inputPortSpecs={unitStuff?.inputPortSpecs}
      outputPortSpecs={[]}
      highlighted={false}
      iconComponent={internalUnitSpec.iconComponent}
      label="output"
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};

const UnitCardRoot = ({ unitItem }: { unitItem: UnitItem }) => {
  if (unitItem.type === "board") {
    return <BoardUnitCard unitItem={unitItem} />;
  } else if (unitItem.type === "edge") {
    if (unitItem.internalUnitKey === "noteInputPort") {
      return <EdgeUnitCard_NoteInputPort unitItem={unitItem} />;
    } else {
      return <EdgeUnitCard_SpeakerPort unitItem={unitItem} />;
    }
  }
};

export const UnitCardsRoot = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <>
      {unitItems.map((item) => (
        <UnitCardRoot key={item.unitId} unitItem={item} />
      ))}
    </>
  );
};
