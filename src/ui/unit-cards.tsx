import { IconType } from "react-icons";
import {
  BoardUnitItem,
  catalog,
  EdgeUnitItem,
  UnitItem,
} from "@/definitions/unit-entries";
import { UnitStuff } from "@/definitions/unit-stuff";
import { store } from "@/store/store";
import { unitCardHandlers } from "@/ui/desk-area-handlers";
import {
  useEdgeUnitCardViewModel_NoteInputPort,
  useEdgeUnitCardViewModel_SpeakerPort,
} from "@/ui/unit-cards-models";
import { UnitPortsColumn } from "@/ui/unit-ports";
import { cz } from "@/utils/cz";

const BoardUnitCard = ({
  unitItem,
  unitStuff,
}: {
  unitItem: BoardUnitItem;
  unitStuff?: UnitStuff;
}) => {
  const catalogItem = catalog[unitItem.catalogKey];
  const inputPortSpecs = unitStuff?.inputPortSpecs;
  const outputPortSpecs = unitStuff?.outputPortSpecs;
  return (
    <div
      className="absolute"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div className="flex-v gap-0.5">
        <div className="flex-ha">
          {inputPortSpecs && <UnitPortsColumn portSpecs={inputPortSpecs} />}
          <div
            className="h-100px bg-white cursor-pointer"
            onPointerDown={(e) =>
              unitCardHandlers.handlePointerDown(e, unitItem)
            }
          >
            <img
              src={catalogItem.thumbnailUrl}
              className="w-full h-full object-contain"
              alt={catalogItem.name}
            />
          </div>
          {outputPortSpecs && <UnitPortsColumn portSpecs={outputPortSpecs} />}
        </div>
        <div className="flex-c text-sm">{catalogItem.name}</div>
      </div>
    </div>
  );
};

const EdgeUnitCardView = ({
  unitItem,
  highlighted,
  iconComponent: IconComponent,
  label,
  handlePointerDown,
}: {
  unitItem: EdgeUnitItem;
  highlighted: boolean;
  iconComponent: IconType;
  label: string;
  handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className="absolute"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
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
    </div>
  );
};

const EdgeUnitCard_NoteInputPort = ({
  unitItem,
}: {
  unitItem: EdgeUnitItem;
}) => {
  const vm = useEdgeUnitCardViewModel_NoteInputPort(unitItem);
  return <EdgeUnitCardView {...vm} />;
};

const EdgeUnitCard_SpeakerPort = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const vm = useEdgeUnitCardViewModel_SpeakerPort(unitItem);
  return <EdgeUnitCardView {...vm} />;
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
      return <EdgeUnitCard_NoteInputPort unitItem={unitItem} />;
    } else {
      return <EdgeUnitCard_SpeakerPort unitItem={unitItem} />;
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
