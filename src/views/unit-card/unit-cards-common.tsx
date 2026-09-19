import { Icons } from "@/common/icons";
import { UnitItem, UnitPortSpec } from "@/domain/types";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { useUnitCardPortPositionManager } from "@/views/unit-card/unit-card-port-position-manager";
import { UnitPortsColumn } from "@/views/unit-card/unit-ports";
import { cz } from "@lib/utils/cz";
import { IconType } from "react-icons";

export function useUnitStuff(unitId: string) {
  const { unitStuffs } = store.useSnapshot();
  return unitStuffs[unitId];
}

export const UnitCardOperationOverlay = ({
  unitItem,
}: {
  unitItem: UnitItem;
}) => {
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

export const EdgeUnitCardView = ({
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
            "w-90px h-90px bg-white/10 flex-c relative shadow-md rounded-6px",
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
