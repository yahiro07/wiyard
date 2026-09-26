import {
  BoardUnitItem,
  NoteInputPortUnitItem,
  SpeakerPortUnitItem,
  UnitItem,
} from "@/domain/types";
import { getCatalogItem, internalUnitCardIcons } from "@/domain/unit-entries";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { unitCardHandlers } from "@/views/unit-card/unit-card-handlers";
import { useUnitCardPortPositionManager } from "@/views/unit-card/unit-card-port-position-manager";
import { UnitPortsColumn } from "@/views/unit-card/unit-ports";
import { AutomationEditorUnitCardRoot } from "@/views/unit-card/automation-editor-unit-card";
import {
  useUnitStuff,
  UnitCardOperationOverlay,
  EdgeUnitCardView,
} from "@/views/unit-card/unit-cards-common";
import { ControlSurfaceUnitCardRoot } from "@/views/unit-card/control-surface-unit-card";
import { renderLog } from "@lib/utils/render-log";
import { UnitCardPartControlButton } from "@/views/unit-card/unit-card-part-control-button";
import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
import { cz } from "@lib/utils/cz";

const BoardUnitMenuOverlayContainer = ({
  unitItem,
}: {
  unitItem: BoardUnitItem;
}) => {
  const { menuTargetUnitId } = store.useSnapshot();
  const isMenuTarget = menuTargetUnitId === unitItem.unitId;
  if (!isMenuTarget) return;
  return <UnitCardOperationOverlay unitItem={unitItem} />;
};

const BoardUnitCard = ({ unitItem }: { unitItem: BoardUnitItem }) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  const portPositionManager = useUnitCardPortPositionManager(unitItem);
  const catalogItem = getCatalogItem(unitItem.catalogKey);
  const inputPortSpecs = unitStuff?.inputPortSpecs;
  const outputPortSpecs = unitStuff?.outputPortSpecs;
  const isPlaybackCapable =
    unitPlaybackCapabilityFlags[unitItem.catalogKey] ?? false;

  renderLog("BoardUnitCard", unitItem.unitId);
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
              "relative h-100px max-w-200px bg-#aaa rounded-3px shadow-md overflow-hidden",
              "cursor-pointer",
            )}
            onPointerDown={(e) =>
              unitCardHandlers.handlePointerDown(e, unitItem)
            }
          >
            {catalogItem ? (
              <img
                src={catalogItem.thumbnailUrl}
                className="h-full object-cover"
                style={{ objectPosition: "left" }}
                alt={catalogItem.name}
              />
            ) : (
              <div className="w-150px h-full text-black flex-c text-sm">
                error: catalog item not found for {unitItem.catalogKey}
              </div>
            )}
            <BoardUnitMenuOverlayContainer unitItem={unitItem} />
          </div>
          {isPlaybackCapable && (
            <div className="absolute top-0 right-full">
              <UnitCardPartControlButton unitId={unitItem.unitId} />
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
      <div className="absolute bottom-0 left-0 right-0 -mb-22px">
        <div className="flex-c text-sm">
          {catalogItem?.name ?? `error (${unitItem.catalogKey})`}
        </div>
      </div>
    </div>
  );
};

const EdgeUnitCard_NoteInputPort = ({
  unitItem,
}: {
  unitItem: NoteInputPortUnitItem;
}) => {
  const unitStuff = useUnitStuff(unitItem.unitId);
  const { currentNoteChannelId } = store.useSnapshot();
  const notePortIndex = notePortGetters.useNoteInputPortIndex(unitItem.unitId);
  const isCurrent = unitItem.unitId === currentNoteChannelId;
  const sequencerUnitId = notePortGetters.getSequencerUnitId(unitItem.unitId);
  return (
    <EdgeUnitCardView
      unitItem={unitItem}
      inputPortSpecs={[]}
      outputPortSpecs={unitStuff?.outputPortSpecs}
      highlighted={isCurrent}
      label={`input ${notePortIndex + 1}`}
      iconComponent={internalUnitCardIcons.noteInputPort}
      handlePointerDown={(e) => unitCardHandlers.handlePointerDown(e, unitItem)}
      controlUi={<UnitCardPartControlButton unitId={sequencerUnitId} />}
    />
  );
};

const EdgeUnitCard_SpeakerPort = ({
  unitItem,
}: {
  unitItem: SpeakerPortUnitItem;
}) => {
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
  } else if (unitItem.type === "automationEditor") {
    //rendered separately
  } else if (unitItem.type === "controlSurface") {
    return <ControlSurfaceUnitCardRoot unitItem={unitItem} />;
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
