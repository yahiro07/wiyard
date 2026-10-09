import { Icons } from "@/common/icons";
import {
  BoardUnitItem,
  UnitItem,
  UnitPortSpec,
  UnitStuff,
} from "@/domain/types";
import { actions } from "@/store/actions";
import { controlEffectUnitGetters } from "@/store/control-effect-unit-getters";
import { store } from "@/store/store";
import { useUnitCardPortPositionManager } from "@/views/unit-card/unit-card-port-position-manager";
import { UnitPortsColumn } from "@/views/unit-card/unit-ports";
import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { IconType } from "react-icons";

export function useUnitStuff(unitId: string): UnitStuff | undefined {
  const { unitStuffs } = store.useSnapshot();
  return unitStuffs[unitId];
}

export const UnitCardLoadingOverlay = ({ loading }: { loading: boolean }) => {
  return (
    <div
      className="absolute-full bg-gray-100 flex-c pointer-events-none"
      style={{
        opacity: loading ? 0.7 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Icons.Spinner className="animate-spin" size={34} color="gray" />
    </div>
  );
};

export const UnitCardOperationOverlay = ({
  unitItem,
}: {
  unitItem: BoardUnitItem;
}) => {
  const isControlEffectCompatible =
    controlEffectUnitGetters.isUnitControlEffectCompatible(unitItem.catalogKey);
  const closeOverlay = () => actions.setMenuTargetUnit(null);
  const buttonClass = "mx-1 my-1.5 cursor-pointer";

  return (
    <div
      className="absolute-full bg-black/35"
      onPointerDown={(e) => {
        actions.setMenuTargetUnit(null);
        e.stopPropagation();
      }}
    >
      <div className="absolute-top-center">
        <button
          type="button"
          className={buttonClass}
          onPointerDown={(e) => {
            actions.removeUnit(unitItem.unitId);
            e.stopPropagation();
          }}
        >
          <Icons.Trash size={24} />
        </button>
      </div>
      {isControlEffectCompatible && (
        <div className="absolute top-0 right-0">
          <button
            type="button"
            className={buttonClass}
            onPointerDown={(e) => {
              actions.toggleUnitControlEffect(unitItem.unitId);
              closeOverlay();
              e.stopPropagation();
            }}
          >
            <Icons.Sliders size={24} />
          </button>
        </div>
      )}
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
  controlUi,
}: {
  unitItem: UnitItem;
  inputPortSpecs?: UnitPortSpec[];
  outputPortSpecs?: UnitPortSpec[];
  highlighted: boolean;
  iconComponent: IconType;
  label: string;
  handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  controlUi?: ReactNode;
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
        <div className="relative">
          <div
            className={cz(
              "w-90px h-90px bg-white/10 flex-c relative shadow-md rounded-6px relative",
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
          {controlUi && (
            <div className="absolute top-0 right-90px">{controlUi}</div>
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
