import { useState } from "react";
import { IconType } from "react-icons";
import {
  BoardUnitItem,
  EdgeUnitItem,
  UnitItem,
  UnitPortSpec,
  UnitStuff,
} from "@/domain/types";
import { catalog, internalUnitSpecs } from "@/domain/unit-entries";
import { unitCardHandlers } from "@/presenter/desk-area-handlers";
import { createUnitCardPortPositionManager } from "@/realms/unit-card/unit-card-port-position-manager";
import { useEdgeUnitCardStates_NoteInputPort } from "@/realms/unit-card/unit-cards-models";
import { UnitPortsColumn } from "@/realms/unit-card/unit-ports";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const BoardUnitCard = ({
  unitItem,
  unitStuff,
}: {
  unitItem: BoardUnitItem;
  unitStuff?: UnitStuff;
}) => {
  const [portPositionManager] = useState(createUnitCardPortPositionManager);
  const catalogItem = catalog[unitItem.catalogKey];
  const inputPortSpecs = unitStuff?.inputPortSpecs;
  const outputPortSpecs = unitStuff?.outputPortSpecs;

  return (
    <div
      ref={portPositionManager.setupResizeObserver}
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
  const [portPositionManager] = useState(createUnitCardPortPositionManager);
  return (
    <div
      ref={portPositionManager.setupResizeObserver}
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
  unitStuff,
}: {
  unitItem: EdgeUnitItem;
  unitStuff?: UnitStuff;
}) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  const { index, isCurrent } = useEdgeUnitCardStates_NoteInputPort(unitItem);
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      outputPortSpecs={unitStuff?.outputPortSpecs}
      highlighted={isCurrent}
      label={`input ${index + 1}`}
      iconComponent={internalUnitSpec.iconComponent}
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};

const EdgeUnitCard_SpeakerPort = ({
  unitItem,
  unitStuff,
}: {
  unitItem: EdgeUnitItem;
  unitStuff?: UnitStuff;
}) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      inputPortSpecs={unitStuff?.inputPortSpecs}
      highlighted={false}
      iconComponent={internalUnitSpec.iconComponent}
      label="output"
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
    />
  );
};

const UnitCardRoot = ({
  unitItem,
  unitStuff,
}: {
  unitItem: UnitItem;
  unitStuff?: UnitStuff;
}) => {
  if (unitItem.type === "board") {
    return <BoardUnitCard unitItem={unitItem} unitStuff={unitStuff} />;
  } else if (unitItem.type === "edge") {
    if (unitItem.internalUnitKey === "noteInputPort") {
      return (
        <EdgeUnitCard_NoteInputPort unitItem={unitItem} unitStuff={unitStuff} />
      );
    } else {
      return (
        <EdgeUnitCard_SpeakerPort unitItem={unitItem} unitStuff={unitStuff} />
      );
    }
  }
};

export const UnitCardsRoot = () => {
  const { unitItems, unitStuffs } = store.useSnapshot();
  return (
    <>
      {unitItems.map((item) => (
        <UnitCardRoot
          key={item.unitId}
          unitItem={item}
          unitStuff={unitStuffs[item.unitId]}
        />
      ))}
    </>
  );
};
