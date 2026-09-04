import { Connection, ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import {
  BoardUnitItem,
  EdgeUnitItem,
  internalUnitSpecs,
  UnitItem,
} from "@/definitions/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import {
  useSequencerWindowViewModel,
  useWindowCoordViewModel,
} from "@/store/view-models";
import { BoardWindow } from "@/ui/board-window";
import { deskAreaHandlers, unitCardHandlers } from "@/ui/desk-area-handlers";
import { cz } from "@/utils/cz";
import catalog from "../unit-inventories.json";

const BoardUnitCard = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const catalogItem = catalog[unitItem.catalogKey];
  return (
    <div
      className="absolute"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div
        className="w-200px h-100px bg-white cursor-pointer"
        onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
      >
        <img
          src={catalogItem.thumbnailUrl}
          className="w-full h-full object-contain"
          alt={catalogItem.name}
        />
      </div>
    </div>
  );
};

const EdgeUnitCard = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  const isNoteInputPort = unitItem.internalUnitKey === "noteInputPort";
  return (
    <div
      className="absolute"
      style={{ left: unitItem.cardPosition.x, top: unitItem.cardPosition.y }}
    >
      <div
        className={cz(
          "w-100px h-100px bg-white/50 flex-c",
          isNoteInputPort && "cursor-pointer",
        )}
        onPointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
      >
        <internalUnitSpec.iconComponent size={55} />
      </div>
    </div>
  );
};

const UnitCardRoot = ({ unitItem }: { unitItem: UnitItem }) => {
  if (unitItem.type === "board") {
    return <BoardUnitCard unitItem={unitItem} />;
  } else if (unitItem.type === "edge") {
    return <EdgeUnitCard unitItem={unitItem} />;
  }
};

const BoardUnitWindow = ({
  unitItem,
  isCurrent,
  evacuated,
}: {
  unitItem: BoardUnitItem;
  isCurrent: boolean;
  evacuated: boolean;
}) => {
  const windowCoordVm = useWindowCoordViewModel(unitItem);
  return (
    <BoardWindow
      title={unitItem.unitId}
      windowCoordVm={windowCoordVm}
      displayed={isCurrent}
      evacuated={evacuated}
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalog[unitItem.catalogKey].loaderPageUrl}
      />
    </BoardWindow>
  );
};

const EdgeUnitWindow = ({ unitItem }: { unitItem: EdgeUnitItem }) => {
  const internalUnitSpec = internalUnitSpecs[unitItem.internalUnitKey];
  return (
    <ReactUnitFrame
      unitId={unitItem.unitId}
      unitTemplateFn={internalUnitSpec.factory}
    />
  );
};

const UnitWindowRoot = ({
  unitItem,
  currentEffectUnitId,
  windowsEvacuated,
}: {
  unitItem: UnitItem;
  currentEffectUnitId: string | null;
  windowsEvacuated: boolean;
}) => {
  if (unitItem.type === "board") {
    return (
      <BoardUnitWindow
        key={unitItem.unitId}
        unitItem={unitItem}
        isCurrent={unitItem.unitId === currentEffectUnitId}
        evacuated={windowsEvacuated}
      />
    );
  } else if (unitItem.type === "edge") {
    return <EdgeUnitWindow key={unitItem.unitId} unitItem={unitItem} />;
  } else {
    return null;
  }
};

const SequencerWindow = ({
  visible,
  evacuated,
}: {
  visible: boolean;
  evacuated: boolean;
}) => {
  const windowCoordVm = useSequencerWindowViewModel();
  return (
    <BoardWindow
      title="sequencer"
      windowCoordVm={windowCoordVm}
      displayed={visible}
      evacuated={evacuated}
    >
      <div>aaa</div>
    </BoardWindow>
  );
};

const EvacuationBars = () => {
  const baseClass =
    "absolute left-0 w-full flex-c min-h-40px cursor-pointer bg-gray-300/50";
  return (
    <>
      {true && (
        <div
          className={cz(baseClass, "top-0")}
          onClick={actions.toggleWindowsEvacuated}
        />
      )}
      {false && (
        <div
          className={cz(baseClass, "bottom-0")}
          onClick={actions.toggleWindowsEvacuated}
        />
      )}
    </>
  );
};

export const DeskArea = () => {
  const {
    unitItems,
    currentEffectUnitId,
    windowsEvacuated,
    sequencerWindowVisible,
  } = store.useSnapshot();
  return (
    <div
      className="grow relative bg-gray-400"
      onPointerDown={deskAreaHandlers.handlePointerDown}
    >
      <EvacuationBars />
      <div>
        {unitItems.map((item) => (
          <UnitCardRoot key={item.unitId} unitItem={item} />
        ))}
      </div>
      <div>
        {unitItems.map((item) => {
          return (
            <UnitWindowRoot
              key={item.unitId}
              unitItem={item}
              currentEffectUnitId={currentEffectUnitId}
              windowsEvacuated={windowsEvacuated}
            />
          );
        })}
      </div>
      <SequencerWindow
        visible={sequencerWindowVisible}
        evacuated={windowsEvacuated}
      />
      <Connection source="speakerPort" destination="$output" />
    </div>
  );
};
